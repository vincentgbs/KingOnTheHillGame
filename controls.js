var controls = {
    start: false,
    action: 'piece',
    active_piece: false,
    getCursorPosition: function (ctx, event) {
        const rect = ctx.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        return {h: Math.floor(x/canvas.settings.size),
            v: Math.floor(y/canvas.settings.size)};
    },
    select_piece: function(coord) {
        piece = game.check_for_piece(coord);
        if (!this.active_piece && piece.player == game.turn) {
            this.active_piece = piece; // loose definition
            this.action = 'move';
            piece.active = true;
            let moves = game.filter_move(
                game.get_adjacent(
                    piece.location), piece);
            game.highlight_move(moves);
            canvas.render(game);
        } else {
            console.debug("Invalid piece");
        }
    },
    unselect_piece: function() {
        this.action = 'piece';
        let p = new Promise((resolve, reject) => {
            this.active_piece.active = false
            if (this.active_piece.active == false) {
                resolve('Continue');
            } else {
                reject('Error');
            }
        });
        return p.then((message) => {
            this.active_piece = false;
            return true;
        }).catch((message) => {
            console.debug(message);
            return false;
        });
    },
    select_move: function(coord) {
        if (this.active_piece.location.h == coord.h &&
        this.active_piece.location.v == coord.v) {
            this.unselect_piece();
            game.highlight_move([]);
            canvas.render(game);
        } else {
            let options = game.filter_move(game.get_adjacent(this.active_piece.location), this.active_piece);
            for (i in options) {
                if (coord.h == options[i].h && coord.v == options[i].v) {
                    this.action = 'build';
                    if(game.move(this.active_piece, {v:coord.v,h:coord.h})) {
                        let builds = game.filter_build(game.get_adjacent(this.active_piece.location), this.active_piece);
                        game.highlight_move(builds);
                        canvas.render(game);
                        return true;
                    }
                }
            } // else
            console.debug('You cannot move there');
        }
    },
    select_build: function(coord) {
        // let piece = this.active_piece;
        let options = game.filter_build(game.get_adjacent(this.active_piece.location), this.active_piece);
        for (i in options) {
            if (coord.h == options[i].h && coord.v == options[i].v) {
                game.build(coord);
                this.unselect_piece();
                game.highlight_move([]); // un-highlight
                game.take_turn();
                canvas.render(game);
                return true;
            }
        } // else
        console.debug('You cannot build there');
    },
    on_click: function(c, e) {
        let coord = this.getCursorPosition(c, e);
        if (this.start) {
            if (this.action == 'piece') {
                this.select_piece(coord);
            } else if (this.action == 'move') {
                this.select_move(coord);
            } else if (this.action == 'build') {
                this.select_build(coord);
            }
        }
    },
    update_turn: function(game) {
        let t = document.querySelector("#player_turn");
        t.style.color = game.settings.piece_colors[game.turn];
        t.innerHTML = game.settings.piece_colors[game.turn];
    }
}

document.addEventListener("DOMContentLoaded", function(event) {
    console.debug('layout.js loaded');
    const c = document.querySelector("#board");
    c.addEventListener('mousedown', function(e) {
        controls.on_click(c, e);
    });
});
