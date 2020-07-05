var controls = {
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
        if(this.active_piece && piece.active) {
            this.active_piece = false;
            piece.active = false;
            canvas.render(game);
        } else if (!this.active_piece && piece.player == game.turn) {
            this.active_piece = true;
            piece.active = true;
            canvas.render(game);
        } else {
            console.debug(coord);
        }
    },
    select_move: function() {
        //
    },
    select_build: function() {
        //
    }
}

document.addEventListener("DOMContentLoaded", function(event) {
    console.debug('layout.js loaded');
    const c = document.querySelector("#board");
    c.addEventListener('mousedown', function(e) {
        controls.select_piece(c, e);
    });
});
