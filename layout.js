var canvas = {
    settings: {
        levels: ['lightgreen', 'yellowgreen', 'khaki', 'darksalmon'],
        highlight_square: 'aqua',
        highlight_piece: 'aqua',
        regular_piece: 'black'
    },
    set: function(canvas, context) {
        this.c = canvas;
        this.ctx = context;
        return this;
    },
    resize: function (height, width) {
        this.c.height = height;
        this.c.width = width;
        return this;
    },
    draw_board: function() {
        for(var i = 1; i <= game.settings.horizontal; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i * 100, 0);
            this.ctx.lineTo(i * 100, game.settings.vertical * 100);
            this.ctx.stroke();
        }
        for(var i = 1; i <= game.settings.vertical; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * 100);
            this.ctx.lineTo(game.settings.horizontal * 100, i * 100);
            this.ctx.stroke();
        }
        return this;
    },
    draw_level: function(location, level) {
        this.ctx.fillStyle = this.settings.levels[level];
        this.ctx.fillRect(location.h*100 + (10*level), location.v*100 + (10*level), 99 - (20*level), 99 - (20*level));
        return this;
    },
    draw_base: function(location) {
        return this.draw_level(location, 0);
    },
    draw_mid: function(location) {
        return this.draw_level(location, 1);
    },
    draw_top: function(location) {
        return this.draw_level(location, 2);
    },
    draw_cap: function(location) {
        return this.draw_level(location, 3);
    },
    highlight_square: function(location) {
        this.ctx.strokeStyle = this.settings.highlight_square;
        this.ctx.strokeRect(location.h*100, location.v*100, 99, 99);
        return this;
    },
    draw_piece: function(location, type, color, active) {
        this.ctx.beginPath();
        if (active) {
            this.ctx.strokeStyle = this.settings.highlight_piece;
        } else {
            this.ctx.strokeStyle = this.settings.regular_piece;
        }
        this.ctx.arc(location.h*100 + 50, location.v*100 + 50, 25, 0, 2 * Math.PI);
        this.ctx.stroke();
        this.ctx.font = "30px Arial";
        this.ctx.fillStyle = color;
        this.ctx.textAlign = "center";
        if (type == 'king') {
            this.ctx.fillText('K', location.h*100 + 50, location.v*100 + 60);
        } else if (type == 'pawn') {
            this.ctx.fillText('P', location.h*100 + 50, location.v*100 + 60);
        } else {
            this.ctx.fillText('0', location.h*100 + 50, location.v*100 + 60);
        }
        return this;
    },
    redraw_board: function(game) {
        canvas.resize(game.settings.vertical * 100, game.settings.horizontal * 100);
        canvas.draw_board();
        for(i in game.board) {
            let row = game.board[i];
            for(j in game.board[i]) {
                let location = game.board[i][j];
                let coord = {v:i, h:j};
                if (location.level == 1) {
                    this.draw_base(coord);
                } else if (location.level == 2) {
                    this.draw_base(coord);
                    this.draw_mid(coord);
                } else if (location.level == 3) {
                    this.draw_base(coord);
                    this.draw_mid(coord);
                    this.draw_top(coord);
                } else if (location.level == 4) {
                    this.draw_base(coord);
                    this.draw_mid(coord);
                    this.draw_top(coord);
                    this.draw_cap(coord);
                }
                if (location.option) {
                    this.highlight_square(coord);
                }
            }
        }
        return this;
    },
    redraw_pieces: function(game) {
        for(i in game.players) {
            let player = game.players[i];
            for(j in player.pieces) {
                let piece = player.pieces[j];
                let coord = {
                    v: piece.location.v,
                    h: piece.location.h
                };
                this.draw_piece(
                    coord,
                    piece.type,
                    game.settings.piece_colors[i],
                    piece.active
                );
            }
        }
    },
    render: function(game) {
        this.redraw_board(game);
        this.redraw_pieces(game);
        controls.update_turn(game);
    },
    declare_winner: function() {
        this.ctx.fillStyle = 'yellow';
        this.ctx.fillRect(0, 0, game.settings.horizontal*100, game.settings.vertical*50);
        this.ctx.font = "80px Arial";
        this.ctx.textAlign = "center";
        this.ctx.fillStyle = 'black';
        this.ctx.fillText('Winner', game.settings.horizontal*50, game.settings.vertical*25);
        return this;
    },
    animateTurn: function(turn) {
        controls.select_piece(turn.from);
        controls.start = false; // for animation
        setTimeout(function() {
            controls.select_move(turn.to);
            setTimeout(function() {
                controls.select_build(turn.build);
                game.log.push(turn);
                game.active_turn = {player: game.turn};
                controls.start = true; // for animation
            }, game.settings.animationDelay);
        }, game.settings.animationDelay);
    }
}

document.addEventListener("DOMContentLoaded", function(event) {
    console.debug('layout.js loaded');
    const c = document.querySelector("#board");
    const ctx = c.getContext("2d");
    canvas.set(c, ctx);
});
