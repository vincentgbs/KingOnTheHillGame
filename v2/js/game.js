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
    board: [],
    players: [],
    turn: {
        active: 0
    },
    log: [],
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
    create_location: function() {
        return {
            level: 0,
            highlight: false,
        };
    },
    create_locations: function() {
        let board = [];
        for(let i = 0; i < this.settings.vertical; i++) {
            row = [];
            for(let j = 0; j < this.settings.horizontal; j++) {
                row.push(game.create_location());
            }
            board.push(row);
        }
        return board;
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
        game.create_locations();
    },
}

document.addEventListener("DOMContentLoaded", function(event) {
    console.debug('game.js loaded');
});
