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
    start_game: function() {
        //game.start_game();
        //layout.start_game();
    },
}

document.addEventListener("DOMContentLoaded", function(event) {
    console.log('controls.js (2) loaded');
    if (document.querySelector("#remote_url")) {
        document.querySelector("#remote_url").onkeyup = remote.get_url;
    }
    if (document.querySelector("#no_of_players")) {
        document.querySelector("#no_of_players").onchange = controls.get_nop;
    }
    if (document.querySelector("#remote_or_local")) {
        document.querySelector("#remote_or_local").onchange = controls.remote_or_local;
    }
});
