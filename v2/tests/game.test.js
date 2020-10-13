let test_game = {
    unit_tests: function() {
        test_game.start_game();
    },
    start_game: function() {
        game.settings.no_of_players = 2;
        console.log('game.settings.no_of_players = 2;');
        game.set_board();
        console.log('game.set_board();');
        game.start_game();
        console.log('game.start_game();');
        if (game.board.locations.length == 7) {
            console.log('game.board.locations.length == 7');
        } else {
            console.log('FAILED TEST: wrong number of rows');
        }
        if (game.board.locations[0].length == 7) {
            console.log('game.board.locations[0].length == 7');
        } else {
            console.log('FAILED TEST: wrong number of columns');
        }
        if (game.players.length == 2) {
            console.log('game.players.length == 2');
        } else {
            console.log('FAILED TEST: wrong number of players');
        }
    },
}

document.addEventListener("DOMContentLoaded", function(event) {
    console.log('game.test.js loaded');
    test_game.unit_tests();
});
