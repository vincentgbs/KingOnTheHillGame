var game = {
    settings: {
        game_id: false,
        no_of_players: 2,
        vertical: 9, // static
        horizontal: 9, // static
        piece_colors: ['royalblue', 'darkorange', 'forestgreen', 'darkred'], // static
        egg_timer: 2500,
    },
    players: [],
    eggs: [],
    create_location: function(row, col) {
        return {row:row, col:col, egg: false};
    },
    create_player: function(pid) {
        return {
            pid: pid,
            location: {row:1, col:1, egg: false},
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
        for(let i = 0; i < game.players.length; i++) {
            //
        }
    },
}

document.addEventListener("DOMContentLoaded", function(event) {
    console.log('game.js (0) loaded');
    let player0 = game.create_player(0); // DEBUGGING
    game.players.push(player0); // DEBUGGING
});
