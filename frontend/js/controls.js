var controls = {
    settings: {
        player: -1,
        start: false,
    },
    getCursorPosition: function (ctx, event) {
        const rect = ctx.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        return {col: Math.floor(x/layout.settings.square_size),
            row: Math.floor(y/layout.settings.square_size)};
    },
    on_click: function(c, e) {
        let cont = true;
        if (game.get_current_turn() != controls.settings.player) {
            cont = false;
        }
        if (remote.settings.local ===  true) {
            cont = true;
        }
        if (cont) {
            let coord = this.getCursorPosition(c, e);
            console.debug(coord);
        } else {
            console.debug("It's not your turn");
        }
    },
    get_nop: function() {
        game.settings.no_of_players = document.querySelector("#no_of_players").value;
    },
    remote_or_local: function() {
        if (document.querySelector("#remote_or_local").value == 'remote') {
            remote.settings.local = false;
        } else {
            remote.settings.local = true;
        }
    },
    new_game: function() {
        controls.settings.player = 0;
        remote.new_game();
    },
    join_game: async function() {
        let player = await remote.join_game();
        console.log(player);
    },
}

document.addEventListener("DOMContentLoaded", function(event) {
    console.log('controls.js (2) loaded');
    const canvas = document.querySelector("#board");
    canvas.addEventListener('mousedown', function(e) {
        controls.on_click(canvas, e);
    });
});
