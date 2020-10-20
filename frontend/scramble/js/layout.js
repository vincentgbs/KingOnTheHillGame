var layout = {
    settings: {
        screen_ratio: (2/3),
        square_size: null,
        framerate: 1000,
    },
    canvas: null,
    context: null,
    set: function(canvas, height, width){
        layout.canvas = canvas;
        layout.context = canvas.getContext("2d");
        layout.settings.square_size = Math.min(
            ((height/game.settings.vertical) * layout.settings.screen_ratio),
            ((width/game.settings.horizontal) * layout.settings.screen_ratio)
        );
        layout.draw_lines();
    },
    resize: function (height, width) {
        layout.canvas.height = height;
        layout.canvas.width = width;
    },
    draw_lines: function() {
        layout.resize(game.settings.vertical * layout.settings.square_size,
            game.settings.horizontal * layout.settings.square_size);
        for(let i = 1; i <= game.settings.horizontal; i++) {
            layout.context.beginPath();
            layout.context.moveTo(i * layout.settings.square_size, 0);
            layout.context.lineTo(i * layout.settings.square_size,
                game.settings.vertical * layout.settings.square_size);
            layout.context.stroke();
        }
        for(let i = 1; i <= game.settings.vertical; i++) {
            layout.context.beginPath();
            layout.context.moveTo(0, i * layout.settings.square_size);
            layout.context.lineTo(game.settings.horizontal * layout.settings.square_size,
                i * layout.settings.square_size);
            layout.context.stroke();
        }
    },
    draw_block: function(location) {
        layout.context.fillStyle = 'black';
        layout.context.beginPath();
        layout.context.rect(
            location.col*layout.settings.square_size,
            location.row*layout.settings.square_size,
            (layout.settings.square_size),
            (layout.settings.square_size)
        );
        layout.context.fill();
    },
    draw_blocks: function() {
        for (let i = 0; i < game.settings.vertical; i++ ) {
            for (let j = 0; j < game.settings.horizontal; j++ ) {
                if (i%2==0 && j%2==0) {
                    layout.draw_block(game.create_location(i, j));
                }
            }
        }
    },
    draw_player: function(player) {
        let location = player.location;
        let color = game.settings.piece_colors[player.pid];
        let x = (location.row * layout.settings.square_size) + (layout.settings.square_size/2);
        let y = (location.col * layout.settings.square_size) + (layout.settings.square_size/2);
        layout.context.beginPath();
        layout.context.arc(x, y, (layout.settings.square_size/3), 0, Math.PI*2);
        layout.context.fillStyle = 'blue';
        layout.context.fill();
        layout.context.closePath();
    },
    draw_players: function() {
        for(let i = 0; i < game.players.length; i++) {
            draw_player(game.players);
        }
    },
    div_overlap: function (a, b) {
    	let aPos = a.position();
    	let bPos = b.position();
    	let aLeft = aPos.left;
    	let aRight = aPos.left + a.width();
    	let aTop = aPos.top;
    	let aBottom = aPos.top + a.height();
    	let bLeft = bPos.left;
    	let bRight = bPos.left + b.width();
    	let bTop = bPos.top;
    	let bBottom = bPos.top + b.height();
    	return !( bLeft > aRight || bRight < aLeft || bTop > aBottom || bBottom < aTop);
    },
    render: function() {
        layout.draw_lines();
        layout.draw_blocks();
    },
};

document.addEventListener("DOMContentLoaded", function(event) {
    console.log('layout.js (1) loaded');
    const canvas = document.querySelector("#board");
    layout.set(canvas, window.screen.height, window.screen.width);
    // setInterval(layout.render, layout.framerate);
});
