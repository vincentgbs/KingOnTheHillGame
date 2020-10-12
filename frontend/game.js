var game = {
    game_id: 'game_id_goes_here',
    settings: { // default board
        no_of_players: 2,
        vertical: 7,
        horizontal: 7,
        level: 4,
        piece_types: ['king', 'pawn', 'pawn'],
        piece_colors: ['blue', 'orange', 'green', 'red', 'purple', 'yellow'],
    },
    board: [],
    players: [],
    turn: 0,
    log: [],
    active_turn: {player: 0, from: {}, to: {}, build: {}},
    updating_settings: function(key, value) {
        this.settings[key] = value;
    },
    create_locations: function() {
        for(let i = 0; i < this.settings.vertical; i++) {
            row = [];
            for(let j = 0; j < this.settings.horizontal; j++) {
                row.push({
                    level: 0,
                    option: false
                });
            }
            this.board.push(row);
        }
        return this.board;
    },
    create_players: function(nop) {
        this.settings.no_of_players = nop;
        for (let id = 0; id < nop; id++) {
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
    create_board: function(nop) {
        this.create_locations();
        this.create_players(nop);
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
                if (piece.type == 'king' && piece.player == (this.turn%this.settings.no_of_players)) {
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
        return this.players[(this.turn%this.settings.no_of_players)].pieces;
    },
    highlight_move: function(list) {
        for(let i = 0; i < this.settings.vertical; i++) {
            row = [];
            for(let j = 0; j < this.settings.horizontal; j++) {
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
        this.active_turn.from = piece.location;
        let pawn_swap = this.check_for_piece(board_location);
        if (piece.type == 'king' &&
        this.board[board_location.v][board_location.h].level == 3) {
            game.active_turn.to = board_location;
            remote.send_turn(game.active_turn);
            return this.winning_move(piece, board_location);
        } else if (piece.type == 'king' && pawn_swap) {
            pawn_swap.location = piece.location;
        }
        piece.location = {
            v: board_location.v,
            h: board_location.h,
            l: this.board[board_location.v][board_location.h].level
        };
        this.active_turn.to = board_location;
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
        this.active_turn.build = location;
        canvas.render(this);
        return this;
    },
    take_turn: function(turn) {
        if (typeof turn == 'object') {
            // moved to canvas.animateTurn()
        } else {
            let temp = this.active_turn;
            this.log.push(temp);
            remote.send_turn(temp);
            this.turn++;
            this.active_turn = {player: (this.turn%this.settings.no_of_players)};
        }
    },
    set_board: function(no) {
        controls.start = true;
        let start = [
            [{v:0,h:3}, {v:0,h:2}, {v:0,h:4}],
            [{v:6,h:3}, {v:6,h:2}, {v:6,h:4}],
            [{v:3,h:0}, {v:2,h:0}, {v:4,h:0}],
            [{v:3,h:6}, {v:2,h:6}, {v:4,h:6}],
        ]
        for (let j = 0; j < no; j++) {
            console.debug(j);
            console.debug(game.players);
            console.debug(game.players[j]);
            for (i in game.players[j].pieces) {
                game.move(game.players[j].pieces[i], start[j][i]);
            }
        }
    },
    start_game: function() {
        let nop = document.querySelector("#no_of_players").value;
        document.querySelector(".turn").innerHTML = 'Turn: <text id="player_turn"></text> <text id="player_turn"></text> <text id="game_id"></text>';
        game.settings.no_of_players = nop;
        remote.start_new_game(nop);
    },
    join_game: function() {
        let id = document.querySelector("#join_game_id").value;
        document.querySelector(".turn").innerHTML = 'Turn: <text id="player_turn"></text> <text id="player_turn"></text> <text id="game_id"></text>';
        remote.join_game(id);
    }
}

document.addEventListener("DOMContentLoaded", function(event) {
    console.debug('game.js loaded');
    document.querySelector("#start_game").onclick=function(){
        game.start_game();
    }
    document.querySelector("#join_game").onclick=function() {
        game.join_game();
    }
});
