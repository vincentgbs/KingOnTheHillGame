var controls = {
    action: 'piece',
    active_piece: false,
    getCursorPosition: function (canvas, event) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        return {h: Math.floor(x/100), v: Math.floor(y/100)};
    },
    select_piece: function(c, e) {
        let coord = this.getCursorPosition(c, e);
        piece = game.check_for_piece(coord);
        if (!this.active_piece && piece.player == game.turn) {
            this.active_piece = piece; // loose definition
            this.action = 'move';
            piece.active = true;
            canvas.render(game);
        } else {
            console.debug(coord);
        }
    },
    select_move: function(c, e) {
        let coord = this.getCursorPosition(c, e);
        if (this.active_piece.location.h == coord.h &&
        this.active_piece.location.v == coord.v) {
            let piece = game.check_for_piece(coord);
            this.action = 'piece';
            piece.active = false;
            this.active_piece = false;
            canvas.render(game);
        } else {
            console.debug(this.active_piece);
            let options = game.filter_move(game.get_adjacent(this.active_piece.location), this.active_piece);
            for (i in options) {
                if (coord.h == options[i].h && coord.v == options[i].v) {
                    this.action = 'build';
                    game.move(this.active_piece, {v:coord.v,h:coord.h});
                    canvas.render(game);
                    return true;
                }
            } // else
            console.debug('You cannot move there');
        }
    },
    select_build: function(c, e) {
        let piece = this.active_piece;
        let coord = this.getCursorPosition(c, e);
        console.debug(this.active_piece.location);
        console.debug(this.active_piece);
        let options = game.filter_build(game.get_adjacent(this.active_piece.location), this.active_piece);
        for (i in options) {
            if (coord.h == options[i].h && coord.v == options[i].v) {
                game.build(coord);
                this.action = 'piece';
                piece.active = false;
                this.active_piece = false;
                game.take_turn();
                canvas.render(game);
                return true;
            }
        } // else
        console.debug('You cannot build there');
    },
    on_click: function(c, e) {
        if (this.action == 'piece') {
            this.select_piece(c, e);
        } else if (this.action == 'move') {
            this.select_move(c, e);
        } else if (this.action == 'build') {
            this.select_build(c, e);
        }
    }
}

document.addEventListener("DOMContentLoaded", function(event) {
    console.debug('layout.js loaded');
    const c = document.querySelector("#board");
    c.addEventListener('mousedown', function(e) {
        controls.on_click(c, e);
    });
});
