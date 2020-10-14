var controls = {
    get_nop: function() {
        game.settings.no_of_players = document.querySelector("#no_of_players").value;
    },
    remote_or_local: function() {
        if (document.querySelector("#remote_or_local").value == 'remote') {
            remote.local = false;
        } else {
            remote.local = true;
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
