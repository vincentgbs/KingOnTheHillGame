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
    draw_base: function(location) {
        this.ctx.fillStyle = 'blue';
        this.ctx.fillRect(location.h*100,location.v*100,99,99);
    },
    draw_mid: function(location) {
        this.ctx.fillStyle = 'green';
        this.ctx.fillRect(location.h*100 + 10,location.v*100 + 10,79,79);
    },
    draw_top: function(location) {
        this.ctx.fillStyle = 'yellow';
        this.ctx.fillRect(location.h*100 + 20,location.v*100 + 20,59,59);
    },
    draw_cap: function(location) {
        this.ctx.fillStyle = 'red';
        this.ctx.fillRect(location.h*100 + 30,location.v*100 + 30,39,39);
    },
    draw_piece: function(location) {
        this.ctx.beginPath();
        this.ctx.arc(location.h*50, location.v*50, 25, 0, 2 * Math.PI);
        this.ctx.stroke();
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
    canvas.draw_base({h:1, v:1});
    canvas.draw_mid({h:1, v:1});
    canvas.draw_top({h:1, v:1});
    canvas.draw_cap({h:1, v:1});

    canvas.draw_piece({h:1, v:1});
});
