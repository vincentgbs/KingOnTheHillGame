var layout = {
    settings: {
        screen_ratio: (2/3),
        square_size: null,
        level_colors: ['lightgreen', 'yellowgreen', 'khaki', 'darksalmon'],
        highlight_square: 'aqua',
        highlight_piece: 'aqua',
        regular_piece: 'black',
        piece_symbol_size: '30px Arial',
        animateDelay: 999,
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
    start_game: function() {
        let html = '<label>Turn: </label><text id="player_turn"></text>';
        if (game.settings.game_id) {
            html += ' <label>Game Id: </label><text id="game_id">'+game.settings.game_id+'</text>';
        }
        html += ' <button id="start_new_game">Start New Game</button>';
        document.querySelector("#turn").innerHTML = html;
    },
    draw_board: function() {
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
    draw_piece: function(piece) {
        layout.context.beginPath();
        if (piece.active) {
            layout.context.strokeStyle = layout.settings.highlight_piece;
        } else {
            layout.context.strokeStyle = layout.settings.regular_piece;
        }
        layout.context.arc(
            piece.location.col*layout.settings.square_size + (layout.settings.square_size/2),
            piece.location.row*layout.settings.square_size + (layout.settings.square_size/2),
            (layout.settings.square_size/5), 0, 2 * Math.PI);
        layout.context.stroke();
        layout.context.font = layout.settings.piece_symbol_size;
        layout.context.fillStyle = game.settings.piece_colors[piece.player];
        layout.context.textAlign = "center";
        let symbol = {'king': 'K', 'pawn': 'P'}[piece.type]
        layout.context.fillText(symbol, piece.location.col*layout.settings.square_size
        + (layout.settings.square_size/2), piece.location.row*layout.settings.square_size
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
    redraw_pieces: function() {
        for(let i = 0; i < game.players.length; i++) {
            let player = game.players[i];
            for(let j = 0; j < player.pieces.length; j++) {
                layout.draw_piece(player.pieces[j]);
            }
        }
    },
    render: function(game) {
        layout.redraw_board(game);
        layout.redraw_pieces(game);
        layout.update_turn();
    },
    declare_winner: function() {
        let setting = {
            message: 'Winner',
            background_fill: 'yellow',
            font_size: '80px Arial',
            font_color: 'black',
        }
        layout.context.fillStyle = setting.background_fill;
        layout.context.fillRect(0, 0, game.settings.horizontal*layout.settings.square_size,
            game.settings.vertical*(layout.settings.square_size/2));
        layout.context.font = setting.font_size;
        layout.context.textAlign = "center";
        layout.context.fillStyle = setting.font_color;
        layout.context.fillText(setting.message,
            game.settings.horizontal*(layout.settings.square_size/2),
            game.settings.vertical*(layout.settings.square_size/4)
        );
    },
    animateTurn: function(turn) {
        let player = game.players[turn.pid];
        let piece = game.board.get_piece(turn.from);
        player.select_piece(piece);
        layout.render();
        setTimeout(function(){ // select_piece
            piece.move(turn.to);
            layout.render();
            setTimeout(function(){ // move
                piece.build(turn.build);
                layout.render();
                setTimeout(function(){ // build
                    player.end_turn();
                    layout.render();
                }, layout.settings.animateDelay);
            }, layout.settings.animateDelay);
        }, layout.settings.animateDelay);
    },
    update_turn: function() {
        let turn = document.querySelector("#player_turn");
        turn.style.color = game.settings.piece_colors[game.get_current_player()];
        turn.innerHTML = game.settings.piece_colors[game.get_current_player()];
    },
    flashMessage: function(message, time) {
        let div = document.querySelector("#flash_message");
        div.innerText = message;
        div.style.display = 'block';
        setTimeout(function() {
            div.innerText = '';
            div.style.display = 'none';
        }, time);
    },
};

document.addEventListener("DOMContentLoaded", function(event) {
    console.log('layout.js (1) loaded');
    const canvas = document.querySelector("#board");
    layout.set(canvas, window.screen.height, window.screen.width);
});
