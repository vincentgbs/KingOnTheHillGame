var game = {
    settings: { // default board
        no_of_players: 2,
        vertical: 5,
        horizontal: 7,
        level: 4,
        piece_types: ['king', 'pawn', 'pawn'],
        piece_colors: ['blue', 'orange', 'green', 'red', 'purple', 'yellow']
    },
    board: [],
    players: [],
    // log: [],
    // active_turn: {player: 0, from: {}, to: {}, build: {}},
    turn: 0,
    updating_settings: function(key, value) {
        this.settings[key] = value;
    },
    create_locations: function() {
        for(var i = 0; i < this.settings.vertical; i++) {
            row = [];
            for(var j = 0; j < this.settings.horizontal; j++) {
                row.push({
                    level: 0,
                    option: false
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
        } else if (location.v >= (this.settings.vertical - 1)) {
            v.push(location.v-1);
        } else {
            v.push(location.v-1);
            v.push(location.v+1);
        }
        if (location.h == 0) {
            h.push(location.h+1);
        } else if (location.h >= (this.settings.horizontal - 1)) {
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
                     options.push({v: v[i], h: h[j]});
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
            } else if (this.board[board_loc.v][board_loc.h].level > piece.location.l + 1) {
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
    highlight_move: function(list) {
        for(var i = 0; i < this.settings.vertical; i++) {
            row = [];
            for(var j = 0; j < this.settings.horizontal; j++) {
                let highlight = false;
                for (k in list) {
                    if (i == list[k].v && j == list[k].h) {
                        highlight = true;
                    }
                }
                this.board[i][j].option = highlight;
            }
            this.board.push(row);
        }
    },
    move: function(piece, board_location) {
        let pawn_swap = this.check_for_piece(board_location);
        if (piece.type == 'king' &&
        this.board[board_location.v][board_location.h].level == 3) {
            return this.winning_move(piece, board_location);
        } else if (piece.type == 'king' && pawn_swap) {
            // no need to check piece or player of destination because filter_move should already have removed any illegal options
            pawn_swap.location = piece.location;
        }
        piece.location = {
            v: board_location.v,
            h: board_location.h,
            l: this.board[board_location.v][board_location.h].level
        };
        canvas.render(this);
        return piece.location;
    },
    winning_move: function(piece, board_location) {
        console.debug('Winner!');
        piece.location = {
            v: board_location.v,
            h: board_location.h,
            l: this.board[board_location.v][board_location.h].level
        };
        canvas.render(this);
        canvas.declare_winner();
        controls.start = false;
    },
    build: function(location) {
        this.board[location.v][location.h].level++
        canvas.render(this);
        return this;
    },
    take_turn: function() {
        // this.log.push(this.active_turn);
        game.turn = (game.turn+1) % game.settings.no_of_players;
        // this.active_turn = {};
    }
}

document.addEventListener("DOMContentLoaded", function(event) {
    console.debug('game.js loaded');
    document.querySelector("#start_game").onclick=function(){
        this.style.display = 'none';
        document.querySelector("#fade_out_title").style.display = 'none';
        controls.start = true;
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
        // create default board
        game.move(k0, {v:0,h:3});
        game.move(p0p1, {v:0,h:2});
        game.move(p0p2, {v:0,h:4});
        game.move(k1, {v:4,h:3});
        game.move(p1p1, {v:4,h:2});
        game.move(p1p2, {v:4,h:4});
    }
});
