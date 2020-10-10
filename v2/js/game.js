let game = {
    settings: {
        no_of_players: 2,
        vertical: 7, // odd
        horizontal: 7, // odd
        level: 4,
        piece_types: ['pawn', 'king', 'pawn'],
        player_colors: ['blue', 'orange', 'green', 'red', 'purple', 'yellow'],
        starting_positions: [
            [{v:0,h:(((7-1)/2)-1)}, {v:0,h:((7-1)/2)}, {v:0,h:(((7-1)/2)+1)}],
            [{v:(7-1),h:(((7-1)/2)-1)}, {v:(7-1),h:((7-1)/2)}, {v:(7-1),h:(((7-1)/2)+1)}],
            [{v:(((7-1)/2)-1),h:0}, {v:((7-1)/2),h:0}, {v:(((7-1)/2)+1),h:0}],
            [{v:(((7-1)/2)-1),h:(7-1)}, {v:((7-1)/2),h:(7-1)}, {v:(((7-1)/2)+1),h:(7-1)}],
        ],
    },
    players: [],
    turn: {
        active: 0
    },
    log: [],
    board: {
        locations: [],
        get_adjacent: function(location) {
            v = [location.v];
            h = [location.h];
            if (location.v == 0) {
                v.push(location.v+1);
            } else if (location.v >= (game.settings.vertical - 1)) {
                v.push(location.v-1);
            } else {
                v.push(location.v-1);
                v.push(location.v+1);
            }
            if (location.h == 0) {
                h.push(location.h+1);
            } else if (location.h >= (game.settings.horizontal - 1)) {
                h.push(location.h-1);
            } else {
                h.push(location.h-1);
                h.push(location.h+1);
            }
            options = [];
            for(var i = 0; i < v.length; i++)
            {
                 for(var j = 0; j < h.length; j++)
                 {
                     if(!(v[i]== location.v && h[j] == location.h)) {
                         options.push(game.create_location(v[i], h[j]));
                     }
                 }
            }
            return options;
        },
        check_for_piece: function(location) {
            for(i in this.players) {
                let player = this.players[i];
                for(j in player.pieces) {
                    let piece = player.pieces[j];
                    if (location.v == piece.location.v &&
                        location.h == piece.location.h) {
                        return true;
                    }
                }
            }
            return false;
        },
        get_piece_at: function(location) {
            //
        }
    },
    create_player: function(turn_number) {
        let player = {
            turn_number: turn_number,
            pieces: game.create_pieces(),
        };
        return player;
    },
    create_players: function() {
        for (let id = 0; id < this.settings.no_of_players; id++) {
            game.players.push(game.create_player(id));
        }
    },
    create_piece: function(player_number, type) {
        return {
            player: player_number,
            active: false,
            type: type,
            location: {v:-1, h:-1, l:-1},
            move: function(location) {
                //
            },
            build: function(location) {
                //
            },
        };
    },
    create_pieces: function(player_number) {
        let pieces = [];
        for (let i = 0; i < game.settings.piece_types.length; i++) {
            pieces.push(
                game.create_piece(player_number, game.settings.piece_types[i])
            );
        }
        return pieces;
    },
    create_location: function(v, h) {
        return {
            v: v,
            h: h,
            level: 0,
            highlight: false,
        };
    },
    create_locations: function(columns, rows) {
        let board = [];
        for(let i = 0; i < columns; i++) {
            row = [];
            for(let j = 0; j < rows; j++) {
                row.push(game.create_location(i, j));
            }
            board.push(row);
        }
        return board;
    },
    create_board: function() {
        game.board.locations = game.create_locations(this.settings.vertical, this.settings.horizontal);
    },
    create_turn: function() {
        let turn = {
            from: null,
            to: null,
            build: null,
        };
        return turn;
    },
    start_game: function() {
        game.create_players();
        game.create_board();
    },
}

document.addEventListener("DOMContentLoaded", function(event) {
    console.debug('game.js loaded');
});
