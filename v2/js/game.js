let game = {
    settings: {
        no_of_players: 2,
        vertical: 7,
        horizontal: 7,
        level: 4,
        piece_types: ['king', 'pawn', 'pawn'],
        piece_colors: ['blue', 'orange', 'green', 'red', 'purple', 'yellow'],
        starting_positions: [
            [{v:0,h:3}, {v:0,h:2}, {v:0,h:4}],
            [{v:6,h:3}, {v:6,h:2}, {v:6,h:4}],
            [{v:2,h:0}, {v:3,h:0}, {v:4,h:0}],
            [{v:2,h:6}, {v:3,h:6}, {v:4,h:6}],
        ],
    },
    create_player: function(turn_number) {
        let player = {};
        return player;
    },
    create_piece: function(turn_number) {
        return {
            player: turn_number,
            active: false,
            type: game.settings.piece_types[j],
            location: {v:-1, h:-1, l:-1},
        };
    },
    create_location: function() {
        return {
            level: 0,
            highlight: false,
        };
    },
    create_turn: function() {
        let turn = {
            from: null,
            to: null,
            build: null,
        };
        return turn;
    },
    board: [
        //
    ],
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
}

document.addEventListener("DOMContentLoaded", function(event) {
    console.debug('game.js loaded');
});
