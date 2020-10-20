var controls = {
    settings: {
        player: 0,
        speed: 1,
    },
    overlap: function(player, location) {
        if (player.location.row == location.row && player.location.col == location.col) {
            return true;
        }
    },
    avoid_blocks: function(player) {
        for (let i = 0; i < game.settings.vertical; i++ ) {
            for (let j = 0; j < game.settings.horizontal; j++ ) {
                if (i%2==0 && j%2==0) {
                    if (controls.overlap(player, game.create_location(i, j))) {
                        return false;
                    }
                }
            }
        } // else
        return true;
    },
    holdArrow: function(direction, e)
    {
        game.players[controls.settings.player].move(direction);
        return e.preventDefault();
    },
    spacebar: function(e) {
        game.players[controls.settings.player].drop_egg();
        return e.preventDefault();
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
}

document.addEventListener("DOMContentLoaded", function(event) {
    console.log('controls.js (3) loaded');
    controls.addEventListeners();
});
