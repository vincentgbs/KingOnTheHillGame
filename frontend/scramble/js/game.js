var game = {
    settings: {
        game_id: false,
        no_of_players: 4,
        vertical: 9, // static
        horizontal: 9, // static
        piece_colors: ['royalblue', 'darkorange', 'forestgreen', 'darkred'], // static
        egg_timer: 2500,
        splash_zone: 2,
        splash_timer: 500,
        starting_positions: [
            {v:1,h:((9-1)/2)},
            {v:(9-2),h:((9-1)/2)},
            {v:((9-1)/2),h:1},
            {v:((9-1)/2),h:(9-2)},
        ],
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
            location: {row:-1, col:-1, egg: false},
            move: function(direction) {
                let player = this;
                if (direction == 'u') {
                    player.location.col -= controls.settings.speed;
                } else if (direction == 'd') {
                    player.location.col += controls.settings.speed;
                } else if (direction == 'l') {
                    player.location.row -= controls.settings.speed;
                } else if (direction == 'r') {
                    player.location.row += controls.settings.speed;
                }
                // undo move if blocked
                if (!controls.avoid_blocks(player) ||
                player.location.col < 0 || player.location.row < 0 ||
                player.location.col >= game.settings.vertical || player.location.row >= game.settings.horizontal) {
                    if (direction == 'u') {
                        player.location.col += controls.settings.speed;
                    } else if (direction == 'd') {
                        player.location.col -= controls.settings.speed;
                    } else if (direction == 'l') {
                        player.location.row += controls.settings.speed;
                    } else if (direction == 'r') {
                        player.location.row -= controls.settings.speed;
                    }
                }
            }, // move
            drop_egg: function() {
                let player = this;
                game.eggs.push(game.create_egg(game.eggs.length, game.create_location(player.location.row, player.location.col)));
            },
        }; // return player
    }, // create_player()
    create_egg: function(index, location) {
        setTimeout(function() {
            game.eggsplosion(index, location);
        }, game.settings.egg_timer);
        return {
            show: true,
            location: location,
        };
    },
    eggsplosion: function(index, location) {
        game.eggs[index].show = false;
        game.check_players_in_splash_zone(location);
        game.splashes.push(game.create_splash(game.splashes.length, location));
    },
    create_splash: function(index, location) {
        setTimeout(function() {
            game.splashes[index].show = false;
        }, game.settings.splash_timer);
        return {
            show: true,
            location: location,
        };
    },
    check_players_in_splash_zone: function(location) {
        for(let i = 0; i < game.players.length; i++) {
            let check = game.players[i].location;
            if (check.row == location.row) {
                if (check.col > (location.col-game.settings.splash_zone) &&
                check.col < (location.col+game.settings.splash_zone) ) {
                    game.players[i].surviving = false;
                    console.log(game.players[i].pid + ' eggsploded.');
                }
            }
            if (check.col == location.col) {
                if (check.row > (location.row-game.settings.splash_zone) &&
                check.row < (location.row+game.settings.splash_zone) ) {
                    game.players[i].surviving = false;
                    console.log(game.players[i].pid + ' eggsploded.');
                }
            }
        }
    },
    start_game: function() {
        for (let i = 0; i < game.settings.no_of_players; i++) {
            let player = game.create_player(i);
            let xy = game.settings.starting_positions[i];
            player.location = game.create_location(xy.h, xy.v);
            game.players.push(player);
        }
    },
}

document.addEventListener("DOMContentLoaded", function(event) {
    console.log('game.js (0) loaded');
});
