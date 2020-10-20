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
        return {row:row, col:col, level: 0, highlight: false};
    },
    create_player: function(pid) {
        return {
            pid: pid,
        }
    },
    create_egg: function() {
        //
    },
}

document.addEventListener("DOMContentLoaded", function(event) {
    console.log('game.js (0) loaded');
});
