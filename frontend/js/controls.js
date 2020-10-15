var controls = {
    settings: {
        player: -1,
        start: false,
    },
    getCursorPosition: function (ctx, event) {
        const rect = ctx.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        return {col: Math.floor(x/layout.settings.square_size),
            row: Math.floor(y/layout.settings.square_size)};
    },
    select_piece: function(cd) {
        let location = game.create_location(cd.row, cd.col);
        let piece = game.board.check_for_piece(location);
        if (piece) {
            piece = game.board.get_piece(location);
            console.debug(piece);
        } else {
            console.log('Invalid piece');
        }
    },
    select_move: function(coord) {
        //
    },
    select_build: function(coord) {
        //
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
            if (game.board && game.players) {
                if (controls.action == 'piece') {
                    return controls.select_piece(coord);
                } else if (controls.action == 'move') {
                    return controls.select_move(coord);
                } else if (controls.action == 'build') {
                    return controls.select_build(coord);
                }
            } // else
            console.debug(controls.action);
        } else {
            console.debug("It's not your turn");
        }
    },
    action: 'piece',
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
    },
    join_game: async function() {
        controls.settings.player = await remote.join_game();
    },
}

document.addEventListener("DOMContentLoaded", function(event) {
    console.log('controls.js (2) loaded');
    const canvas = document.querySelector("#board");
    canvas.addEventListener('mousedown', function(e) {
        controls.on_click(canvas, e);
    });
});
