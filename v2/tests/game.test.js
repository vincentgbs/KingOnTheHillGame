let test_game = {
    animateDelay: 1,
    moves: [[ // 8 moves for a player 2 (player[index 1]) win
            [1, 2],[2, 3],[2, 2],[3, 3],[1, 2],[2, 3],[0, 2],[0, 1],
        ],[ // move, build, move build...
            [5, 3],[4, 3],[4, 3],[3, 3],[3, 3],[2, 3],[2, 3],[1, 3],
        ]
    ],
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
            response = await test_game.turn2();
            console.log(response);
        }
        if (response == 'turn2() complete') {
            response = await test_game.turns3to();
            console.log(response);
        }
    },
    // example: async function() {
    //     return new Promise(resolve => {
    //         // test goes here
    //     resolve('example complete'); });
    // },
    turns3to: async function() {
        return new Promise(resolve => {
            let player1 = game.players[0];
            let player2 = game.players[1];
            let pawn1 = player1.pieces[0];
            let king1 = player2.pieces[1];
            setTimeout(function(){ // select_piece
                pawn1.move(game.create_location(test_game.moves[0][2][0], test_game.moves[0][2][1]));
                setTimeout(function(){ // move
                    pawn1.build(game.create_location(test_game.moves[0][3][0], test_game.moves[0][3][1]));
                    setTimeout(function(){ // build
                        player1.end_turn();
                        setTimeout(function(){ // select_piece
                            king1.move(game.create_location(test_game.moves[1][2][0], test_game.moves[1][2][1]));
                            setTimeout(function(){ // move
                                king1.build(game.create_location(test_game.moves[1][3][0], test_game.moves[1][3][1]));
                                setTimeout(function(){ // build
                                    player2.end_turn();
                                    setTimeout(function(){ // select_piece
                                        pawn1.move(game.create_location(test_game.moves[0][4][0], test_game.moves[0][4][1]));
                                        setTimeout(function(){ // move
                                            pawn1.build(game.create_location(test_game.moves[0][5][0], test_game.moves[0][5][1]));
                                            setTimeout(function(){ // build
                                                player1.end_turn();
                                                setTimeout(function(){ // select_piece
                                                    king1.move(game.create_location(test_game.moves[1][4][0], test_game.moves[1][4][1]));
                                                    setTimeout(function(){ // move
                                                        king1.build(game.create_location(test_game.moves[1][5][0], test_game.moves[1][5][1]));
                                                        setTimeout(function(){ // build
                                                            player2.end_turn();
                                                            setTimeout(function(){ // select_piece
                                                                pawn1.move(game.create_location(test_game.moves[0][6][0], test_game.moves[0][6][1]));
                                                                setTimeout(function(){ // move
                                                                    pawn1.build(game.create_location(test_game.moves[0][7][0], test_game.moves[0][7][1]));
                                                                    setTimeout(function(){ // build
                                                                        player1.end_turn();
                                                                        setTimeout(function(){ // select_piece
                                                                            king1.move(game.create_location(test_game.moves[1][6][0], test_game.moves[1][6][1]));
                                                                            setTimeout(function(){ // move
                                                                                king1.build(game.create_location(test_game.moves[1][7][0], test_game.moves[1][7][1]));
                                                                                setTimeout(function(){ // build
                                                                                    player2.end_turn();
                                                                                    resolve('turns3to8() complete'); });
                                                                                }, test_game.animateDelay); // build
                                                                            }, test_game.animateDelay); // move
                                                                        }, test_game.animateDelay); // select_piece
                                                                    }, test_game.animateDelay); // build
                                                                }, test_game.animateDelay); // move
                                                            }, test_game.animateDelay); // select_piece
                                                        }, test_game.animateDelay); // build
                                                    }, test_game.animateDelay); // move
                                                }, test_game.animateDelay); // select_piece
                                            }, test_game.animateDelay); // build
                                        }, test_game.animateDelay); // move
                                    }, test_game.animateDelay); // select_piece
                                }, test_game.animateDelay); // build
                            }, test_game.animateDelay); // move
                        }, test_game.animateDelay); // select_piece
                    }, test_game.animateDelay); // build
                }, test_game.animateDelay); // move
            }, test_game.animateDelay); // select_piece
    },
    turn2: async function() {
        return new Promise(resolve => {
            let player2 = game.players[game.get_current_player()];
            let king1 = player2.pieces[1];
            player2.select_piece(king1);
            setTimeout(function(){ // select_piece
                king1.move(game.create_location(test_game.moves[1][0][0], test_game.moves[1][0][1]));
                setTimeout(function(){ // move
                    king1.build(game.create_location(test_game.moves[1][1][0], test_game.moves[1][1][1]));
                    setTimeout(function(){ // build
                        player2.end_turn();
                        resolve('turn2() complete'); });
                    }, test_game.animateDelay);
                }, test_game.animateDelay);
            }, test_game.animateDelay);
    },
    turn1: async function() {
        return new Promise(resolve => {
            let player1 = game.players[game.get_current_player()];
            let pawn1 = player1.pieces[0];
            player1.select_piece(pawn1);
            setTimeout(function(){ // select_piece
                if (pawn1.active) {
                    console.log('pawn1.active == true');
                } else {
                    console.debug('FAILED TEST: pawn1 not active');
                }
                setTimeout(function(){ // move
                    pawn1.move(game.create_location(test_game.moves[0][0][0], test_game.moves[0][0][1]));
                    if(pawn1.location.row == 1) {
                        console.log('pawn1.location.row == 1');
                    } else {
                        console.debug('FAILED TEST: pawn1 not at row 1');
                    }
                    if(pawn1.location.col == 2) {
                        console.log('pawn1.location.col == 2');
                    } else {
                        console.debug('FAILED TEST: pawn1 not at col 2');
                    }
                    setTimeout(function(){ // build
                        pawn1.build(game.create_location(test_game.moves[0][1][0], test_game.moves[0][1][1]));
                        if (game.board.locations[2][3].level == 1) {
                            console.log('game.board.locations[2][3].level == 1');
                        } else {
                            console.debug('FAILED TEST: board.locations[2][3] is not level 1');
                        }
                        player1.end_turn();
                        resolve('turn1() complete'); });
                    }, test_game.animateDelay); // build
                }, test_game.animateDelay); // move
            }, test_game.animateDelay); // select_piece
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
                console.debug('FAILED TEST: wrong number of rows');
            }
            if (game.board.locations[0].length == 7) {
                console.log('game.board.locations[0].length == 7');
            } else {
                console.debug('FAILED TEST: wrong number of columns');
            }
            if (game.players.length == 2) {
                console.log('game.players.length == 2');
            } else {
                console.debug('FAILED TEST: wrong number of players');
            }
        resolve('start_game() complete'); });
    },
}

document.addEventListener("DOMContentLoaded", function(event) {
    console.log('game.test.js loaded');
    // test_game.unit_tests();
});
