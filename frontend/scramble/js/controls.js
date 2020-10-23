var controls = {
    settings: {
        start: false,
    },
    holdArrow: function(direction, e)
    {
        let player = game.players[remote.settings.player];
        if (controls.settings.start && player.surviving) {
            player.move(direction);
            return e.preventDefault();
        }
    },
    spacebar: function(e) {
        let player = game.players[remote.settings.player];
        if (controls.settings.start && player.surviving) {
            player.drop_egg(player.location, false);
            remote.send_egg();
            return e.preventDefault();
        }
    },
    addEventListeners: function() {
        document.onkeydown = function(e) {
            ek = e.keyCode;
            if (ek==38) {controls.holdArrow('u', e);}
            if (ek==40) {controls.holdArrow('d', e);}
            if (ek==37) {controls.holdArrow('l', e);}
            if (ek==39) {controls.holdArrow('r', e);}
        };
        document.onkeyup = function(e) {
            ek = e.keyCode;
            if (ek==32) {controls.spacebar(e);}
        };
    },
    get_nop: function() {
        game.settings.no_of_players = document.querySelector("#no_of_players").value;
    },
    start_game: async function() {
        let response = await remote.start_game();
        if (response.accepted == 'true') {
            layout.flashMessage('Starting Game...', 500);
            controls.settings.start = true;
        } else {
            layout.flashMessage('Unable to start game', 2500);
        }
    },
    new_game: function() {
        remote.new_game();
    },
    join_game: async function() {
        let response = await remote.join_game();
        if (response.last_check > 0) {
            controls.start_game();
        }
    },
}

document.addEventListener("DOMContentLoaded", function(event) {
    console.log('controls.js (3) loaded');
    controls.addEventListeners();
});
