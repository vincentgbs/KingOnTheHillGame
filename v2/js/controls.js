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
    }
}

document.addEventListener("DOMContentLoaded", function(event) {
    console.log('controls.js (2) loaded');
    document.querySelector("#remote_url").onkeyup = function(e) {
        remote.get_url();
    };

    document.querySelector("#no_of_players").onchange = controls.get_nop;
    document.querySelector("#remote_or_local").onchange = controls.remote_or_local;
});
