var game = {
    settings: { // default board
        no_of_players: 2,
        vertical: 5,
        horizontal: 5,
        level: 4,
        piece_types: ['king', 'pawn', 'pawn']
    },
    board: [],
    players: [],
    turn: 0,
    updating_settings: function(key, value) {
        this.settings[key] = value;
    },
    create_locations: function() {
        // document.getElementById("board").style.height = (this.vertical * 100);
        // document.getElementById("board").style.width = (this.horizontal * 100);
        for(var i = 0; i < this.vertical; i++) {
            row = [];
            for(var j = 0; j < this.horizontal; j++) {
                row.push({
                    level: 0
                });
            }
            this.board.push(row);
        }
    },
    create_players: function() {
        for (var id = 0; id < this.no_of_players; id++) {
            var player = {
                player: id,
                pieces: []
            };
            for (j in this.piece_types) {
                player.pieces.push({
                    type: type,
                    player: id,
                    location: {v:-1, h:-1, l:-1}
                });
            }
            this.players.push(player);
        }
    },
    create_board: function() {
        this.create_locations();
        this.create_players();
        return this;
    },
    get_adjacent: function(location) {
        v = [location.v];
        h = [location.h];
        if (location.v == 0) {
            v.push(location.v+1);
        } else if (location.v == this.vertical) {
            v.push(location.v-1);
        } else {
            v.push(location.v+1);
            v.push(location.v-1);
        }
        if (location.h == 0) {
            h.push(location.h+1);
        } else if (location.h == this.horizontal) {
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
            player = this.players[i];
            for(j in player.pieces) {
                piece = player.pieces[j];
                if (location.v == piece.location.v &&
                    location.h == piece.location.h) {
                    return true;
                }
            }
        }
        return false;
    },
    filter_move: function(options, piece) {
        filtered = [];
        for (i in options) {
            location = options[i];
            if (this.board[location.v][location.h].level >= 4) {
                // skip, do not add to filtered
            } else if (this.board[location.v][location.h].level >= piece.level + 1) {
                // skip, do not add to filtered
            } else if (this.check_for_piece(location)) {
                if (piece.type == 'king' && piece.player == this.turn) {
                    filtered.push(location);
                } else {
                    // skip, do not add to filtered
                }
            } else {
                filtered.push(location);
            }
        }
        return filtered;
    },
    filter_build: function(options, piece) {
        filtered = [];
        for (i in options) {
            location = options[i];
            if (this.board[location.v][location.h].level >= 4) {
                // skip, do not add to filtered
            } else if (this.check_for_piece(location)) {
                // skip, do not add to filtered
            } else {
                filtered.push(location);
            }
        }
        return filtered;
    },
    choose_piece: function(player) {
        //
    },
    move: function(piece, location) {
        // update piece
    },
    build: function(location) {
        // update this.board_locations
    }
}

document.addEventListener("DOMContentLoaded", function(event) {
    var c = document.getElementById("board");
    var ctx = c.getContext("3D");
});
