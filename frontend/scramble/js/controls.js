var controls = {
    settings: {
        player: 0,
        speed: 0.2,
    },
    holdArrow: function(direction, e)
    {
        console.log(direction);
        game.players[controls.settings.player].move(direction);
        return e.preventDefault();
    },
    releaseArrow: function(direction, e)
    {
        console.log(direction);
        return e.preventDefault();
    },
    spacebar: function(e) {
        console.log('spacebar');
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
            if (ek==38) {controls.releaseArrow('u', e);}
            if (ek==40) {controls.releaseArrow('d', e);}
            if (ek==37) {controls.releaseArrow('l', e);}
            if (ek==39) {controls.releaseArrow('r', e);}
            if (ek==32) {controls.spacebar(e);}
        };
    }
}

document.addEventListener("DOMContentLoaded", function(event) {
    console.log('controls.js (3) loaded');
    controls.addEventListeners();
});
