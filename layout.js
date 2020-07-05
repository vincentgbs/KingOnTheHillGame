var canvas = {
    set: function(canvas, context) {
        this.c = canvas;
        this.ctx = context;
    },
    resize: function (height, width) {
        this.c.height = height;
        this.c.width = width;
    },
    draw_board: function() {
        for(var i = 1; i <= game.settings.vertical; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i * 100, 0);
            this.ctx.lineTo(i * 100, game.settings.horizontal * 100);
            this.ctx.stroke();
        }
        for(var i = 1; i <= game.settings.horizontal; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * 100);
            this.ctx.lineTo(game.settings.vertical * 100, i * 100);
            this.ctx.stroke();
        }
    },
    draw: function() {
        // this.ctx.strokeStyle = 'blue';
        // this.ctx.lineWidth = 5;
        // this.ctx.strokeRect(1,1,100,300);

        // this.ctx.beginPath();
        // this.ctx.arc(100, 75, 50, 0, 2 * Math.PI);
        // this.ctx.stroke();
    }
}

document.addEventListener("DOMContentLoaded", function(event) {
    console.debug('layout.js loaded');
    const c = document.querySelector("#board");
    const ctx = c.getContext("2d");
    canvas.set(c, ctx);
    // Default Starting Point
    canvas.resize(game.settings.vertical * 100, game.settings.horizontal * 100);
    canvas.draw_board();
});
