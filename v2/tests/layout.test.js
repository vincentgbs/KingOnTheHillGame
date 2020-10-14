let test_layout = {
    animateDelay: 2500,
    run_test: function() {
        test_game.start_game();
        test_layout.build(test_game.demo0[0]);
        setTimeout(function(){
            test_layout.build(test_game.demo1[0]);
            setTimeout(function(){ // test_game.demo0[1]
                test_layout.build(test_game.demo0[1]);
                setTimeout(function(){ // test_game.demo1[1]
                    test_layout.build(test_game.demo1[1]);
                    setTimeout(function(){ // test_game.demo0[2]
                        test_layout.build(test_game.demo0[2]);
                        setTimeout(function(){ // test_game.demo1[2]
                            test_layout.build(test_game.demo1[2]);
                            setTimeout(function(){ // test_game.demo0[3]
                                test_layout.build(test_game.demo0[3]);
                                setTimeout(function(){ // test_game.demo1[3]
                                    test_layout.build(test_game.demo1[3]);
                                }, test_layout.animateDelay); // test_game.demo1[3]
                            }, test_layout.animateDelay); // test_game.demo0[3]
                        }, test_layout.animateDelay); // test_game.demo1[2]
                    }, test_layout.animateDelay); // test_game.demo0[2]
                }, test_layout.animateDelay); // test_game.demo1[1]
            }, test_layout.animateDelay); // test_game.demo0[1]
        }, test_layout.animateDelay);
    },
    build: function(object) {
        let turn = game.create_turn(object[0]);
        turn.from = game.create_location(object[1][0], object[1][1]);
        turn.to = game.create_location(object[2][0], object[2][1]);
        turn.build = game.create_location(object[3][0], object[3][1]);
        layout.animateTurn(turn);
    },
}

document.addEventListener("DOMContentLoaded", function(event) {
    console.log('layout.test.js loaded');
    // test_layout.run_test();
});
