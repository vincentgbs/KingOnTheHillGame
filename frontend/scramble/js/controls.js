var controls = {
    settings: {
        start: false,
    },
    holdArrow: function(direction, e)
    {
        if (controls.settings.start && game.players[remote.settings.player].surviving) {
            game.players[remote.settings.player].move(direction);
            return e.preventDefault();
        }
    },
    spacebar: function(e) {
        if (controls.settings.start && game.players[remote.settings.player].surviving) {
            game.players[remote.settings.player].drop_egg();
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
            controls.settings.start = true;
        } else {
            layout.flashMessage('Unable to start game', 999);
        }
    },
    new_game: function() {
        remote.new_game();
        layout.game_options();
    },
    join_game: function() {
        remote.join_game();
        layout.game_options();
    },
}

document.addEventListener("DOMContentLoaded", function(event) {
    console.log('controls.js (3) loaded');
    controls.addEventListeners();
});
