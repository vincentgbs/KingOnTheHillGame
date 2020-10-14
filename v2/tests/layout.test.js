let test_layout = {
    demo0: [
        [0, [0, 2], [1, 2], [2, 3]],
        [0, [1, 2], [2, 2], [3, 3]],
        [0, [2, 2], [1, 2], [2, 3]],
        [0, [1, 2], [0, 2], [0, 1]],
    ],
    demo1: [
        [1, [6, 3], [5, 3], [4, 3]],
        [1, [5, 3], [4, 3], [3, 3]],
        [1, [3, 4], [3, 3], [2, 3]],
        [1, [3, 4], [2, 3], [1, 3]],
    ],
    run: function() {
        test_game.start_game();
        test_layout.build(test_layout.demo0[0]);
    },
    build: function(object) {
        let turn = game.create_turn(object[0]);
        turn.from = game.create_location(object[0][0], object[0][1]);
        turn.to = game.create_location(object[1][0], object[1][1]);
        turn.build = game.create_location(object[2][0], object[2][1]);
        layout.animateTurn(turn);
    },
}

document.addEventListener("DOMContentLoaded", function(event) {
    console.log('layout.test.js loaded');
    // test_layout.run();
});
