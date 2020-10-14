var game = {
    settings: {
        game_id: false,
        no_of_players: 2,
        vertical: 7, // static
        horizontal: 7, // static
        level: 4, // static
        piece_types: ['pawn', 'king', 'pawn'], // static
        piece_colors: ['blue', 'orange', 'green', 'red', 'purple', 'yellow'], // static
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
        return {current: game.get_current_turn(),
        pid: pid, from: false, to: false, build: false};
    },
    get_current_turn: function() {
        return game.turn.current;
    },
    get_current_player: function() {
        return (game.turn.current%game.settings.no_of_players);
    },
    create_location: function(row, col) {
        return {row:row, col:col, level: 0, highlight: false};
    },
    create_board: function() {
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
            },
            unhighlight_locations: function() {
                let board = this;
                for(let i = 0; i < game.settings.vertical; i++) {
                    for(let j = 0; j < game.settings.horizontal; j++) {
                        board.locations[i][j].highlight = false;
                    }
                }
            },
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
                game.turn.active.from = piece.location;
                let options = piece.get_move_options();
                for (let i = 0; i < options.length; i++) {
                    game.board.locations[options[i].row][options[i].col].highlight = true;
                }
            },
            unselect_piece: function(piece) {
                piece.active = false;
                game.turn.active.from = {};
                game.board.unhighlight_locations();
            },
            end_turn: function() {
                game.turn.current++;
                game.log.push(game.turn.active);
                game.turn.active = game.create_turn(game.get_current_player());
            }
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
        for (let i = 0; i < game.settings.no_of_players; i++) {
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
            get_build_options: function() {
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
                let piece = this;
                let pawn_swap = game.board.check_for_piece(location);
                if (pawn_swap) {
                    pawn_swap = game.board.get_piece(location);
                    if ((piece.type == 'king') &&
                    (pawn_swap.player == piece.player) &&
                    (game.board.locations[location.row][location.col].level == game.settings.level-1)) {
                        return game.winning_move(piece, location);
                    } else if ((piece.type == 'king') &&
                    (pawn_swap.player == piece.player)) {
                        pawn_swap.location = piece.location;
                    } else {
                        return false;
                    }
                } else if (game.board.locations[location.row][location.col].level == game.settings.level-1) {
                    return game.winning_move(piece, location);
                }
                game.turn.active.to = location;
                this.location = location;
                game.board.unhighlight_locations();
                let options = piece.get_build_options();
                for (let i = 0; i < options.length; i++) {
                    game.board.locations[options[i].row][options[i].col].highlight = true;
                }
            },
            build: function(location) {
                this.active = false;
                game.turn.active.build = location;
                game.board.locations[location.row][location.col].level++;
                game.board.unhighlight_locations();
            },
        };
    },
    get_adjacent: function(location) {
        v = [location.row];
        h = [location.col];
        if (location.row == 0) {
            v.push(location.row+1);
        } else if (location.row >= (game.settings.vertical - 1)) {
            v.push(location.row-1);
        } else {
            v.push(location.row-1);
            v.push(location.row+1);
        }
        if (location.col == 0) {
            h.push(location.col+1);
        } else if (location.col >= (game.settings.horizontal - 1)) {
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
        game.turn.active.to = location;
        piece.location = location;
    },
    start_game: function() {
        game.board = game.create_board();
        game.players = game.create_players();
        game.turn.active = game.create_turn(game.get_current_player());
    },
}

document.addEventListener("DOMContentLoaded", function(event) {
    console.log('game.js (0) loaded');
});
