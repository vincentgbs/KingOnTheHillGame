var canvas = {
    set: function(canvas, context) {
        this.c = canvas;
        this.ctx = context;
    },
    resize: function (height, width) {
        this.c.height = height;
        this.c.width = width;
    }
}

document.addEventListener("DOMContentLoaded", function(event) {
    console.debug('layout.js loaded');
    const c = document.querySelector("#board");
    const ctx = c.getContext("2d");
    canvas.set(c, ctx);
    canvas.resize(window.innerHeight - 20, window.innerWidth - 20);
});
