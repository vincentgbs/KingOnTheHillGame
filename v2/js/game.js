var game = {
    settings: {
        game_id: false,
        no_of_players: false,
        vertical: 7, // odd
        horizontal: 7, // odd
        level: 4,
        piece_types: ['pawn', 'king', 'pawn'],
        piece_colors: ['blue', 'orange', 'green', 'red', 'purple', 'yellow'],
        starting_positions: [
            [{v:0,h:(((7-1)/2)-1)}, {v:0,h:((7-1)/2)}, {v:0,h:(((7-1)/2)+1)}],
            [{v:(7-1),h:(((7-1)/2)-1)}, {v:(7-1),h:((7-1)/2)}, {v:(7-1),h:(((7-1)/2)+1)}],
            [{v:(((7-1)/2)-1),h:0}, {v:((7-1)/2),h:0}, {v:(((7-1)/2)+1),h:0}],
            [{v:(((7-1)/2)-1),h:(7-1)}, {v:((7-1)/2),h:(7-1)}, {v:(((7-1)/2)+1),h:(7-1)}],
        ],
    },
    board: false, // {}
    players: false, // {}
    turn: {
        current: 0,
        active: false,
    },
    log: [],
    create_turn: function(pid) {
        return {pid: pid, from: {}, to: {}, build: {}};
    },
    get_current_player: function() {
        return (game.turn.current%game.settings.no_of_players);
    },
    create_location: function(row, col) {
        return {row:row, col:col, level: 0, highlight: false};
    },
    create_locations: function() {
        let board = {
            locations: [],
            check_for_piece: function(location) {
                return (game.board.get_piece(location) !== -1);
            },
            get_piece: function(location) {
                for(i in game.players) {
                    let player = game.players[i];
                    for(j in player.pieces) {
                        let piece = player.pieces[j];
                        if (location.row == piece.location.row &&
                            location.col == piece.location.col) {
                            return piece; // loose definition
                        }
                    }
                }
                return -1;
            }
        };
        for(let i = 0; i < game.settings.vertical; i++) {
            row = [];
            for(let j = 0; j < game.settings.horizontal; j++) {
                row.push(game.create_location(i, j));
            }
            board.locations.push(row);
        }
        return board;
    },
    create_player: function(pid) {
        let player = {
            pid: pid,
            pieces: [],
            select_piece: function(piece) {
                piece.active = true;
            },
            unselect_piece: function(piece) {
                piece.active = false;
            },
        };
        for (let i = 0; i < game.settings.piece_types.length; i++) {
            player.pieces.push(
                game.create_piece(pid, game.settings.piece_types[i],
                    game.settings.starting_positions[pid][i].v,
                    game.settings.starting_positions[pid][i].h)
            );
        }
        return player;
    },
    create_players: function() {
        let players = [];
        for (let i = 0; i < this.settings.no_of_players; i++) {
            players.push(game.create_player(i));
        }
        return players;
    },
    create_piece: function(pid, type, v, h) {
        return {
            player: pid,
            active: false,
            type: type,
            location: game.create_location(v, h),
            get_move_options: function() {
                let filtered = [];
                let options = game.get_adjacent(this.location);
                for (i in options) {
                    let bl = options[i];
                    if (game.board.locations[bl.row][bl.col].level >= game.settings.level) {
                        // skip, already capped
                    } else if (game.board.locations[bl.row][bl.col].level > this.location.level + 1) {
                        // skip, cannot move up more than once level
                    } else if (game.board.check_for_piece(bl)) {
                        if (this.type == 'king' &&
                            this.player == game.get_current_player()) {
                            filtered.push(bl); // king - pawn swap
                        } else {
                            // skip, cannot move where another piece is
                        }
                    } else {
                        filtered.push(bl);
                    }
                }
                return filtered;
            },
            get_build_options: function(piece) {
                filtered = [];
                let options = game.get_adjacent(this.location);
                for (i in options) {
                    let bl = options[i];
                    if (game.board.locations[bl.row][bl.col].level >= game.settings.level) {
                        // skip, already capped
                    } else if (game.board.check_for_piece(bl)) {
                        // skip, cannot build where another piece is
                    } else {
                        filtered.push(bl);
                    }
                }
                return filtered;
            },
            move: function(location) {
                game.turn.active.from = this.location;
                let pawn_swap = game.board.check_for_piece(location);
                if (pawn_swap) {
                    pawn_swap = game.board.get_piece(location);
                    if (this.type == 'king' &&
                    game.board[location.row][board_location.col].level == game.settings.level-1) {
                        game.turn.active.to = location;
                        return game.winning_move(this, location);
                    } else if ((this.type == 'king') &&
                    (pawn_swap.player == game.get_current_player())) {
                        pawn_swap.location = piece.location;
                    } else {
                        return false;
                    }
                } // else
                game.turn.active.to = location;
                this.location = location;
                this.active = false;
            },
            build: function(location) {
                game.board.locations[location.row][location.col].level++;
                game.turn.active.build = location;
            },
        };
    },
    get_adjacent: function(location) {
        v = [location.row];
        h = [location.col];
        if (location.row == 0) {
            v.push(location.row+1);
        } else if (location.row >= (this.settings.vertical - 1)) {
            v.push(location.row-1);
        } else {
            v.push(location.row-1);
            v.push(location.row+1);
        }
        if (location.col == 0) {
            h.push(location.col+1);
        } else if (location.col >= (this.settings.horizontal - 1)) {
            h.push(location.col-1);
        } else {
            h.push(location.col-1);
            h.push(location.col+1);
        }
        adjacent = [];
        for(var i = 0; i < v.length; i++)
        {
             for(var j = 0; j < h.length; j++)
             {
                 if(!(v[i]== location.row && h[j] == location.col)) {
                     adjacent.push(
                         game.create_location(v[i], h[j])
                     );
                 }
             }
        }
        return adjacent;
    },
    winning_move: function(piece, location) {
        piece.location = location;
    },
    set_board: function() {
        game.board = game.create_locations();
        game.players = game.create_players();
    },
    start_game: function() {
        if (game.settings.no_of_players && game.board && game.players) {
            game.turn.active = game.create_turn();
        }
    },
}

document.addEventListener("DOMContentLoaded", function(event) {
    console.log('game.js loaded');
});
