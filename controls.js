var controls = {
    active_piece: false,
    active_move: false,
    getCursorPosition: function (canvas, event) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        return {h: Math.floor(x/100), v: Math.floor(y/100)};
    },
    select_piece: function(c, e) {
        let coord = this.getCursorPosition(c, e);
        piece = game.check_for_piece(coord);
        if(this.active_piece && piece.active) {
            this.active_piece = false;
            piece.active = false;
            canvas.render(game);
        } else if (!this.active_piece && piece.player == game.turn) {
            this.active_piece = piece; // loose definition
            piece.active = true;
            canvas.render(game);
        } else {
            console.debug(coord);
        }
    },
    select_move: function(c, e) {
        let coord = this.getCursorPosition(c, e);
        let options = game.filter_move(game.get_adjacent(this.active_piece.location));
        for (i in options) {
            if (coord.h == options[i].h && coord.v == options[i].v) {
                console.debug('VALID MOVE');
            }
        } // else
        console.debug('WRONG PLACE');
    },
    select_build: function(c, e) {
        let coord = this.getCursorPosition(c, e);
    },
    on_click: function(c, e) {
        if (this.active_piece == false && this.active_move == false) {
            this.select_piece(c, e);
        } else if (this.active_piece == true && this.active_move == false) {
            this.select_move(c, e);
        } else if (this.active_piece == true && this.active_move == true) {
            //
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
