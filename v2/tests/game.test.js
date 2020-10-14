let test_game = {
    unit_tests: async function() {
        let response = await test_game.start_game();
        console.log(response);
        // if (response == 'example complete') {
        //     response = await test_game.example();
        //     console.log(response);
        // }
        if (response == 'start_game() complete') {
            response = await test_game.turn1();
            console.log(response);
        }
        if (response == 'turn1() complete') {
            // response = await test_game.turn2();
            // console.log(response);
        }
    },
    // example: async function() {
    //     return new Promise(resolve => {
    //         // test goes here
    //     resolve('example complete'); });
    // },
    turn1: async function() {
        return new Promise(resolve => {
            let pawn1 = game.players[0].pieces[0];
            let options = pawn1.get_move_options();
            if (options.length == 4) {
                console.log('options.length == 4');
            } else {
                console.log('FAILED TEST: move options is not 4');
            }
            pawn1.move(game.create_location(1, 2));
            if(pawn1.location.row == 1) {
                console.log('pawn1.location.row == 1');
            } else {
                console.log('FAILED TEST: pawn1 not at row 1');
            }
            if(pawn1.location.col == 2) {
                console.log('pawn1.location.col == 2');
            } else {
                console.log('FAILED TEST: pawn1 not at col 2');
            }
            options = pawn1.get_build_options();
            if (options.length == 7) {
                console.log('options.length == 7');
            } else {
                console.log('FAILED TEST: build options is not 7');
            }
            pawn1.build(game.create_location(2, 3));
            if (game.board.locations[2][3].level == 1) {
                console.log('game.board.locations[2][3].level == 1');
            } else {
                console.log('FAILED TEST: board.locations[2][3] is not level 1');
            }
        resolve('turn1() complete'); });
    },
    start_game: async function() {
        return new Promise(resolve => {
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
        resolve('start_game() complete'); });
    },
}

document.addEventListener("DOMContentLoaded", function(event) {
    console.log('game.test.js loaded');
    test_game.unit_tests();
});
