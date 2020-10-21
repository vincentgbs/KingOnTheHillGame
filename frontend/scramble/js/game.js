var game = {
    settings: {
        game_id: false,
        no_of_players: 2,
        vertical: 11, // static
        horizontal: 11, // static
        piece_colors: ['royalblue', 'darkorange', 'forestgreen', 'darkred'], // static
        egg_timer: 2500,
        splash_zone: 2,
        splash_timer: 500,
        starting_positions: [
            {v:1,h:((11-1)/2)},
            {v:(11-2),h:((11-1)/2)},
            {v:((11-1)/2),h:1},
            {v:((11-1)/2),h:(11-2)},
        ],
        speed: 1, // static
    },
    players: [],
    eggs: [],
    splashes: [],
    create_location: function(row, col) {
        return {row:row, col:col, egg: false};
    },
    create_player: function(pid) {
        return {
            pid: pid,
            surviving: true,
            eggs: [],
            splashes: [],
            location: {row:-1, col:-1, egg: false},
            move: function(direction) {
                let player = this;
                let move = game.create_location(player.location.row, player.location.col);
                if (direction == 'u') {
                    move.col -= game.settings.speed;
                } else if (direction == 'd') {
                    move.col += game.settings.speed;
                } else if (direction == 'l') {
                    move.row -= game.settings.speed;
                } else if (direction == 'r') {
                    move.row += game.settings.speed;
                }
                if (!game.avoid_blocks(move) ||
                move.col < 0 || move.row < 0 ||
                move.col >= game.settings.vertical ||
                move.row >= game.settings.horizontal) {
                    return false;
                } else {
                    for(let i = 0; i < game.players.length; i++) {
                        if (game.overlap(move, game.players[i].location)) {
                            if (game.players[i].surviving) {
                                return false;
                            }
                        }
                    }
                    for(let i = 0; i < game.eggs.length; i++) {
                        if (game.overlap(move, game.eggs[i].location)) {
                            if (game.eggs[i].show) {
                                return false;
                            }
                        }
                    } // else
                    player.location = move;
                }
            }, // move
            drop_egg: function() {
                let player = this;
                let egg = this.create_egg(
                    game.eggs.length,
                    game.create_location(player.location.row, player.location.col)
                );
                game.eggs.push(egg);
                player.eggs.push(egg);
            },
            create_egg: function(index, location) {
                let player = this;
                setTimeout(function() {
                    player.eggsplosion(index, location);
                }, game.settings.egg_timer);
                return {
                    show: true,
                    pid: player.pid,
                    location: location,
                };
            },
            eggsplosion: function(index, location) {
                let player = this;
                game.eggs[index].show = false;
                game.check_players_in_splash_zone(location);
                let splash = player.create_splash(game.splashes.length, location);
                game.splashes.push(splash);
                player.splashes.push(splash);
            },
            create_splash: function(index, location) {
                let player = this;
                setTimeout(function() {
                    game.splashes[index].show = false;
                }, game.settings.splash_timer);
                return {
                    show: true,
                    pid: player.pid,
                    location: location,
                };
            },
        };
    }, // create_player()
    overlap: function(move, location) {
        if (move.row == location.row && move.col == location.col) {
            return true;
        }
    },
    avoid_blocks: function(move) {
        for (let i = 0; i < game.settings.vertical; i++ ) {
            for (let j = 0; j < game.settings.horizontal; j++ ) {
                if (i%2==0 && j%2==0) {
                    if (game.overlap(move, game.create_location(i, j))) {
                        return false;
                    }
                }
            }
        } // else
        return true;
    },
    check_players_in_splash_zone: function(location) {
        for(let i = 0; i < game.players.length; i++) {
            let check = game.players[i].location;
            if (check.row == location.row) {
                if (check.col > (location.col-game.settings.splash_zone) &&
                check.col < (location.col+game.settings.splash_zone) ) {
                    game.players[i].surviving = false;
                }
            }
            if (check.col == location.col) {
                if (check.row > (location.row-game.settings.splash_zone) &&
                check.row < (location.row+game.settings.splash_zone) ) {
                    game.players[i].surviving = false;
                }
            }
        }
    },
    create_game: function() {
        for (let i = 0; i < game.settings.no_of_players; i++) {
            let player = game.create_player(i);
            let rowcol = game.settings.starting_positions[i];
            player.location = game.create_location(rowcol.h, rowcol.v);
            game.players.push(player);
        }
    },
}

document.addEventListener("DOMContentLoaded", function(event) {
    console.log('game.js (0) loaded');
});
