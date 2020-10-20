var controls = {
    move: {
        u: 0, // up
        d: 0, // down
        l: 0, // left
        r: 0, // right
    },
    holdArrow: function(direction, e)
    {
        // console.log(direction);
        controls.move[direction] = 1;
        return e.preventDefault();
    },
    releaseArrow: function(direction, e)
    {
        // console.log(direction);
        controls.move[direction] = 0;
        return e.preventDefault();
    },
    spacebar: function(e) {
        // console.log('spacebar');
        return e.preventDefault();
    },
}

document.addEventListener("DOMContentLoaded", function(event) {
    console.log('controls.js (3) loaded');
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
});
