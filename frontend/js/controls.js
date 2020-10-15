var controls = {
    settings: {
        player: -1,
        winnerDelay: 500,
        winnerRefresh: 10,
    },
    getCursorPosition: function (ctx, event) {
        const rect = ctx.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        return {col: Math.floor(x/layout.settings.square_size),
            row: Math.floor(y/layout.settings.square_size)};
    },
    select_piece: function(coord) {
        let location = game.board.get_location(coord);
        let piece = game.board.check_for_piece(location);
        if (piece) {
            piece = game.board.get_piece(location);
            if (piece.player == game.get_current_player()) {
                let player = game.players[game.get_current_player()];
                player.select_piece(piece);
                controls.action = 'move';
                layout.render();
            } else {
                console.log('Not your piece');
            }
        } else {
            console.log('Not a piece');
        }
    },
    unselect_piece: function(piece) {
        if (piece.player == game.get_current_player()) {
            let player = game.players[game.get_current_player()];
            player.unselect_piece(piece);
            controls.action = 'piece';
            layout.render();
        } else {
            console.log('Not your piece');
        }
    },
    select_move: function(coord) {
        let location = game.board.get_location(coord);
        let piece = game.board.get_piece(game.turn.active.from);
        if (location.highlight) {
            piece.move(location);
            controls.action = 'build';
            layout.render();
        } else if (piece.location.row == location.row &&
        piece.location.col == location.col && piece.active) {
            return controls.unselect_piece(piece);
        } else {
            console.log('Invalid move');
        }
    },
    select_build: function(coord) {
        let location = game.board.get_location(coord);
        if (location.highlight) {
            let player = game.players[game.get_current_player()];
            let piece = game.board.get_piece(game.turn.active.to);
            piece.build(location);
            player.end_turn();
            controls.action = 'piece';
            layout.render();
        } else {
            console.log('Invalid build');
        }
    },
    on_click: function(c, e) {
        let cont = true;
        if (game.get_current_turn() != controls.settings.player) {
            cont = false;
        }
        if (remote.settings.local ===  true) {
            cont = true;
        }
        if (cont) {
            let coord = controls.getCursorPosition(c, e);
            if (controls.start) {
                if (controls.action == 'piece') {
                    return controls.select_piece(coord);
                } else if (controls.action == 'move') {
                    return controls.select_move(coord);
                } else if (controls.action == 'build') {
                    return controls.select_build(coord);
                }
            } else {
                console.log('Game has not started');
            }
        } else {
            console.log("It's not your turn");
        }
    },
    action: 'piece',
    start: false,
    get_nop: function() {
        game.settings.no_of_players = document.querySelector("#no_of_players").value;
    },
    remote_or_local: function() {
        if (document.querySelector("#remote_or_local").value == 'remote') {
            remote.settings.local = false;
        } else {
            remote.settings.local = true;
        }
    },
    new_game: function() {
        controls.settings.player = 0;
        remote.new_game();
        controls.start = true;
    },
    join_game: async function() {
        controls.settings.player = await remote.join_game();
        controls.start = true;
    },
    declare_winner: function(count) {
        controls.start = false;
        layout.declare_winner();
        if (count < controls.settings.winnerRefresh) {
            setTimeout(function(){
                controls.declare_winner(count + 1);
            }, controls.settings.winnerDelay);
        }
    },
}

document.addEventListener("DOMContentLoaded", function(event) {
    console.log('controls.js (2) loaded');
    const canvas = document.querySelector("#board");
    canvas.addEventListener('mousedown', function(e) {
        controls.on_click(canvas, e);
    });
});
