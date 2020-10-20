var game = {
    settings: {
        game_id: false,
        no_of_players: 2,
        vertical: 9, // static
        horizontal: 9, // static
        piece_colors: ['royalblue', 'darkorange', 'forestgreen', 'darkred'], // static
    },
    players: [],
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
            },
        }
    },
    create_egg: function() {
        //
    },
}

document.addEventListener("DOMContentLoaded", function(event) {
    console.log('game.js (0) loaded');
    let player0 = game.create_player(0); // DEBUGGING
    game.players.push(player0); // DEBUGGING
});
