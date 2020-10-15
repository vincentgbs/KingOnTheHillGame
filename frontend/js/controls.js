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
            console.debug("It's not your turn");
            cont = false;
        }
        if (remote.settings.local ===  true) {
            cont = true;
        }
        if (cont) {
            let coord = this.getCursorPosition(c, e);
            console.debug(coord);
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
        remote.new_game();
    },
    join_game: function() {
        remote.join_game();
    },
}

document.addEventListener("DOMContentLoaded", function(event) {
    console.log('controls.js (2) loaded');
    const canvas = document.querySelector("#board");
    canvas.addEventListener('mousedown', function(e) {
        controls.on_click(canvas, e);
    });
    if (document.querySelector("#remote_url")) {
        document.querySelector("#remote_url").onkeyup = remote.get_url;
    }
    if (document.querySelector("#join_game_id")) {
        document.querySelector("#join_game_id").onkeyup = remote.get_gid;
    }
    if (document.querySelector("#no_of_players")) {
        document.querySelector("#no_of_players").onchange = controls.get_nop;
    }
    if (document.querySelector("#remote_or_local")) {
        document.querySelector("#remote_or_local").onchange = controls.remote_or_local;
    }
    if (document.querySelector("#new_game")) {
        document.querySelector("#new_game").onclick = controls.new_game;
    }
    if (document.querySelector("#join_game")) {
        document.querySelector("#join_game").onclick = controls.join_game;
    }
});
