var canvas = {
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
        for(var i = 1; i <= game.settings.vertical; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i * 100, 0);
            this.ctx.lineTo(i * 100, game.settings.horizontal * 100);
            this.ctx.stroke();
        }
        for(var i = 1; i <= game.settings.horizontal; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * 100);
            this.ctx.lineTo(game.settings.vertical * 100, i * 100);
            this.ctx.stroke();
        }
        return this;
    },
    draw_base: function(location) {
        this.ctx.fillStyle = 'blue';
        this.ctx.fillRect(location.h*100,location.v*100,99,99);
        return this;
    },
    draw_mid: function(location) {
        this.ctx.fillStyle = 'green';
        this.ctx.fillRect(location.h*100 + 10,location.v*100 + 10,79,79);
        return this;
    },
    draw_top: function(location) {
        this.ctx.fillStyle = 'yellow';
        this.ctx.fillRect(location.h*100 + 20,location.v*100 + 20,59,59);
        return this;
    },
    draw_cap: function(location) {
        this.ctx.fillStyle = 'red';
        this.ctx.fillRect(location.h*100 + 30,location.v*100 + 30,39,39);
        return this;
    },
    draw_piece: function(location, type, color, active) {
        this.ctx.beginPath();
        if (active) {
            this.ctx.strokeStyle = 'grey';
        } else {
            this.ctx.strokeStyle = 'black';
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
                    piece.active // affects all pieces after it in loop
                );
            }
        }
    },
    render: function(game) {
        this.redraw_board(game);
        this.redraw_pieces(game);
    }
}

document.addEventListener("DOMContentLoaded", function(event) {
    console.debug('layout.js loaded');
    const c = document.querySelector("#board");
    const ctx = c.getContext("2d");
    canvas.set(c, ctx);
});
