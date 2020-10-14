var layout = {
    settings: {
        screen_ratio: (2/3),
        square_size: null,
        level_colors: ['lightgreen', 'yellowgreen', 'khaki', 'darksalmon'],
        highlight_square: 'aqua',
        // regular_square: 'black',
        highlight_piece: 'aqua',
        regular_piece: 'black',
        piece_symbol_size: '30px Arial',
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
        layout.resize(game.settings.vertical * layout.settings.square_size,
            game.settings.horizontal * layout.settings.square_size);
    },
    resize: function (height, width) {
        layout.canvas.height = height;
        layout.canvas.width = width;
    },
    draw_board: function() {
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
    draw_level: function(location, level) {
        layout.context.fillStyle = layout.settings.level_colors[level];
        layout.context.fillRect(
            location.col*layout.settings.square_size + ((layout.settings.square_size/10)*level),
            location.row*layout.settings.square_size + ((layout.settings.square_size/10)*level),
            (layout.settings.square_size-1) - ((layout.settings.square_size/5)*level),
            (layout.settings.square_size-1) - ((layout.settings.square_size/5)*level)
        );
    },
    draw_levels: function(location, level) {
        for(let i = 0; i < level; i++) {
            layout.draw_level(location, i);
        }
    },
    highlight_square: function(location) {
        layout.context.strokeStyle = layout.settings.highlight_square;
        layout.context.strokeRect(
            location.col*layout.settings.square_size,
            location.row*layout.settings.square_size,
            (layout.settings.square_size-1),
            (layout.settings.square_size-1)
        );
    },
    draw_piece: function(location, type, color, active) {
        layout.context.beginPath();
        if (active) {
            layout.context.strokeStyle = layout.settings.highlight_piece;
        } else {
            layout.context.strokeStyle = layout.settings.regular_piece;
        }
        layout.context.arc(
            location.col*layout.settings.square_size + (layout.settings.square_size/2),
            location.row*layout.settings.square_size + (layout.settings.square_size/2),
            (layout.settings.square_size/5), 0, 2 * Math.PI);
        layout.context.stroke();
        layout.context.font = layout.settings.piece_symbol_size;
        layout.context.fillStyle = color;
        layout.context.textAlign = "center";
        let symbol = {'king': 'K', 'pawn': 'P'}[type]
        layout.context.fillText(symbol, location.col*layout.settings.square_size
        + (layout.settings.square_size/2), location.row*layout.settings.square_size
        + (layout.settings.square_size*(3/5)));
    },
    redraw_board: function() {
        layout.draw_board();
        for(let i = 0; i < game.settings.vertical; i++) {
            for(let j = 0; j < game.settings.horizontal; j++) {
                let location = game.board.locations[i][j];
                layout.draw_levels(location, location.level);
                if (location.highlight) {
                    layout.highlight_square(location);
                }
            }
        }
    },
};

document.addEventListener("DOMContentLoaded", function(event) {
    console.log('layout.js loaded');
    const canvas = document.querySelector("#board");
    layout.set(canvas, window.screen.height, window.screen.width);
});
