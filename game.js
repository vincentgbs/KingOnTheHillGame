var game = {
    settings: { // default board
        no_of_players: 2,
        vertical: 5,
        horizontal: 5,
        level: 4,
        piece_types: ['king', 'pawn', 'pawn'],
        piece_colors: ['red', 'blue', 'yellow', 'purple', 'green', 'orange']
    },
    board: [],
    players: [],
    turn: 0,
    updating_settings: function(key, value) {
        this.settings[key] = value;
    },
    create_locations: function() {
        for(var i = 0; i < this.settings.vertical; i++) {
            row = [];
            for(var j = 0; j < this.settings.horizontal; j++) {
                row.push({
                    level: 0
                });
            }
            this.board.push(row);
        }
        return this.board;
    },
    create_players: function() {
        for (var id = 0; id < this.settings.no_of_players; id++) {
            var player = {
                player: id,
                pieces: []
            };
            for (j in this.settings.piece_types) {
                player.pieces.push({
                    player: id,
                    active: false,
                    type: this.settings.piece_types[j],
                    location: {v:-1, h:-1, l:-1}
                });
            }
            this.players.push(player);
        }
    },
    create_board: function() {
        this.create_locations();
        this.create_players();
        canvas.render(this);
        return this;
    },
    get_adjacent: function(location) {
        v = [location.v];
        h = [location.h];
        if (location.v == 0) {
            v.push(location.v+1);
        } else if (location.v == this.settings.vertical) {
            v.push(location.v-1);
        } else {
            v.push(location.v+1);
            v.push(location.v-1);
        }
        if (location.h == 0) {
            h.push(location.h+1);
        } else if (location.h == this.settings.horizontal) {
            h.push(location.h-1);
        } else {
            h.push(location.h+1);
            h.push(location.h-1);
        }
        options = [];
        for(var i = 0; i < v.length; i++)
        {
             for(var j = 0; j < h.length; j++)
             {
                 if(!(h[i] == location.h && v[j]== location.v)) {
                     options.push({h: h[i], v: v[j]});
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
                    return piece; // loose definition
                }
            }
        }
        return false;
    },
    filter_move: function(options, piece) {
        filtered = [];
        for (i in options) {
            board_loc = options[i];
            if (this.board[board_loc.v][board_loc.h].level >= 4) {
                // skip, do not add to filtered
            } else if (this.board[board_loc.v][board_loc.h].level >= piece.location.l + 1) {
                // skip, do not add to filtered
            } else if (this.check_for_piece(board_loc)) {
                if (piece.type == 'king' && piece.player == this.turn) {
                    filtered.push(board_loc);
                } else {
                    // skip, do not add to filtered
                }
            } else {
                filtered.push(board_loc);
            }
        }
        return filtered;
    },
    filter_build: function(options, piece) {
        filtered = [];
        for (i in options) {
            board_loc = options[i];
            if (this.board[board_loc.v][board_loc.h].level >= 4) {
                // skip, do not add to filtered
            } else if (this.check_for_piece(board_loc)) {
                // skip, do not add to filtered
            } else {
                filtered.push(board_loc);
            }
        }
        return filtered;
    },
    get_pieces: function() {
        return this.players[this.turn].pieces;
    },
    move: function(piece, board_location) {
        if (piece.type == 'king' &&
            this.board[board_location.v][board_location.h].level == 3) {
            console.debug('Winner. Game Over.');
            game.board = []; // reset board
            game.players = []; // reset players
            game.turn = 0; // reset game
        }
        piece.location = {
            v: board_location.v,
            h: board_location.h,
            l: this.board[board_location.v][board_location.h].level
        };
        canvas.render(this);
        return piece.location;
    },
    build: function(location) {
        this.board[location.v][location.h].level++
        canvas.render(this);
        return this;
    },
    take_turn: function() {
        // player chooses move from game.filter_move(game.get_adjacent(piece.location))
        // player chooses build from game.filter_build(game.get_adjacent(piece.location))
        game.turn = (game.turn+1) % game.settings.no_of_players;
    }
}

document.addEventListener("DOMContentLoaded", function(event) {
    console.debug('game.js loaded');
    document.querySelector("#start_game").onclick=function(){
        this.style.display = 'none';
        game.create_board();
        // create labels
        let p0 = game.players[0];
        let p1 = game.players[1];
        let k0 = p0.pieces[0];
        let p0p1 = p0.pieces[1];
        let p0p2 = p0.pieces[2];
        let k1 = p1.pieces[0];
        let p1p1 = p1.pieces[1];
        let p1p2 = p1.pieces[2];
        // place pieces on board
        game.move(k0, {v:1,h:2});
        game.move(p0p1, {v:1,h:1});
        game.move(p0p2, {v:1,h:3});
        game.move(k1, {v:3,h:2});
        game.move(p1p1, {v:3,h:1});
        game.move(p1p2, {v:3,h:3});
    }
});
