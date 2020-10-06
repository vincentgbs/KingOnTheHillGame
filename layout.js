var canvas = {
    settings: {
        size: 100,
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
        for(let i = 1; i <= game.settings.horizontal; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i * canvas.settings.size, 0);
            this.ctx.lineTo(i * canvas.settings.size,
                game.settings.vertical * canvas.settings.size);
            this.ctx.stroke();
        }
        for(let i = 1; i <= game.settings.vertical; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * canvas.settings.size);
            this.ctx.lineTo(game.settings.horizontal * canvas.settings.size,
                i * canvas.settings.size);
            this.ctx.stroke();
        }
        return this;
    },
    draw_level: function(location, level) {
        this.ctx.fillStyle = this.settings.levels[level];
        this.ctx.fillRect(location.h*canvas.settings.size + ((canvas.settings.size/10)*level),
            location.v*canvas.settings.size + ((canvas.settings.size/10)*level),
            (canvas.settings.size-1) - ((canvas.settings.size/5)*level),
            (canvas.settings.size-1) - ((canvas.settings.size/5)*level));
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
        this.ctx.strokeRect(location.h*canvas.settings.size,
            location.v*canvas.settings.size,
            (canvas.settings.size-1), (canvas.settings.size-1));
        return this;
    },
    draw_piece: function(location, type, color, active) {
        this.ctx.beginPath();
        if (active) {
            this.ctx.strokeStyle = this.settings.highlight_piece;
        } else {
            this.ctx.strokeStyle = this.settings.regular_piece;
        }
        this.ctx.arc(location.h*canvas.settings.size + (canvas.settings.size/2),
            location.v*canvas.settings.size + (canvas.settings.size/2),
            (canvas.settings.size/5), 0, 2 * Math.PI);
        this.ctx.stroke();
        this.ctx.font = "30px Arial";
        this.ctx.fillStyle = color;
        this.ctx.textAlign = "center";
        if (type == 'king') {
            this.ctx.fillText('K', location.h*canvas.settings.size
            + (canvas.settings.size/2), location.v*canvas.settings.size
            + (canvas.settings.size*(3/5)));
        } else if (type == 'pawn') {
            this.ctx.fillText('P', location.h*canvas.settings.size
            + (canvas.settings.size/2), location.v*canvas.settings.size
            + (canvas.settings.size*(3/5)));
        } else {
            this.ctx.fillText('0', location.h*canvas.settings.size
            + (canvas.settings.size/2), location.v*canvas.settings.size
            + (canvas.settings.size*(3/5)));
        }
        return this;
    },
    redraw_board: function(game) {
        canvas.resize(game.settings.vertical * canvas.settings.size,
            game.settings.horizontal * canvas.settings.size);
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
        this.ctx.fillRect(0, 0, game.settings.horizontal*canvas.settings.size,
            game.settings.vertical*(canvas.settings.size/2));
        this.ctx.font = "80px Arial";
        this.ctx.textAlign = "center";
        this.ctx.fillStyle = 'black';
        this.ctx.fillText('Winner', game.settings.horizontal*(canvas.settings.size/2),
            game.settings.vertical*(canvas.settings.size/4));
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

    let size = Math.min(window.screen.height, window.screen.width) * (2/3);
    canvas.settings.size = (size/game.settings.vertical);
    c.setAttribute('height', size);
    c.setAttribute('width', size);
});
