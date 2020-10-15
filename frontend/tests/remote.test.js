let test_remote = {
    animateDelay: 4500,
    sendDelay: 500,
    player0: {
        user_id: null,
        send_turn: function(index) {
            game.turn.current = (index * 2);
            console.log('player0.send_turn: ' + game.get_current_turn());
            remote.settings.user_id = test_remote.player0.user_id;
            remote.settings.player = 0;
            let turn = test_remote.build(test_game.demo0[index]);
            remote.send_turn(turn);
            setTimeout(function() {
                game.turn.current++;
            }, test_remote.sendDelay + 1);
        },
        get_turn: function(index) {
            game.turn.current = (index * 2) - 1;
            console.log('player0.get_turn: ' + game.get_current_turn());
            remote.settings.player = 0;
            remote.settings.user_id = test_remote.player0.user_id;
            remote.get_turn(remote.settings.timeout_x-1);
        },
    },
    player1: {
        user_id: null,
        send_turn: function(index) {
            game.turn.current = (index * 2) + 1;
            console.log('player1.send_turn: ' + game.get_current_turn());
            remote.settings.user_id = test_remote.player1.user_id;
            remote.settings.player = 1;
            let turn = test_remote.build(test_game.demo1[index]);
            remote.send_turn(turn);
        },
        get_turn: function(index) {
            game.turn.current = (index * 2);
            console.log('player1.get_turn: ' + game.get_current_turn());
            remote.settings.player = 1;
            remote.settings.user_id = test_remote.player1.user_id;
            remote.get_turn(remote.settings.timeout_x-1);
        },
    },
    test: async function() {
        let response = await test_remote.start_game();
        console.log('test_remote.' + response);
        setTimeout(function() { // test_remote.player0.send_turn(0)
            test_remote.player0.send_turn(0);
            setTimeout(function() { // test_remote.player1.send_turn(0);
                test_remote.player1.get_turn(0);
                setTimeout(function () {
                    test_remote.player1.send_turn(0);
                    setTimeout(function() { // test_remote.player0.send_turn(1)
                        test_remote.player0.get_turn(1);
                        setTimeout(function() {
                            test_remote.player0.send_turn(1);
                            setTimeout(function() { // test_remote.player1.send_turn(1);
                                test_remote.player1.get_turn(1);
                                setTimeout(function() {
                                    test_remote.player1.send_turn(1);
                                    setTimeout(function() { // test_remote.player0.send_turn(2)
                                        test_remote.player0.get_turn(2);
                                        setTimeout(function() {
                                            test_remote.player0.send_turn(2);
                                            setTimeout(function() { // test_remote.player1.send_turn(2);
                                                test_remote.player1.get_turn(2);
                                                setTimeout(function() {
                                                    test_remote.player1.send_turn(2);
                                                    setTimeout(function() { // test_remote.player0.send_turn(3)
                                                        test_remote.player0.get_turn(3);
                                                        setTimeout(function() {
                                                            test_remote.player0.send_turn(3);
                                                            setTimeout(function() { // test_remote.player1.send_turn(3);
                                                                test_remote.player1.get_turn(3);
                                                                setTimeout(function() {
                                                                    test_remote.player1.send_turn(3);
                                                                    setTimeout(function() {
                                                                        test_remote.player0.get_turn(4);
                                                                    }, test_remote.animateDelay);
                                                                }, test_remote.sendDelay);
                                                            }, (test_remote.animateDelay)); // test_remote.player1.send_turn(3);
                                                        }, test_remote.sendDelay);
                                                    }, test_remote.animateDelay); // test_remote.player0.send_turn(3)
                                                }, test_remote.sendDelay);
                                            }, (test_remote.animateDelay)); // test_remote.player1.send_turn(2);
                                        }, test_remote.sendDelay);
                                    }, test_remote.animateDelay); // test_remote.player0.send_turn(2)
                                }, test_remote.sendDelay);
                            }, (test_remote.animateDelay)); // test_remote.player1.send_turn(1);
                        }, test_remote.sendDelay);
                    }, test_remote.animateDelay); // test_remote.player0.send_turn(1)
                }, test_remote.sendDelay);
            }, (test_remote.animateDelay)); // test_remote.player1.send_turn(0);
        }, test_remote.animateDelay); // test_remote.player0.send_turn(0)
    },
    build: function(object) {
        let turn = game.create_turn(object[0]);
        turn.from = game.create_location(object[1][0], object[1][1]);
        turn.to = game.create_location(object[2][0], object[2][1]);
        turn.build = game.create_location(object[3][0], object[3][1]);
        turn.current = game.get_current_turn();
        return turn;
    },
    start_game: async function() {
        return new Promise(resolve => {
            remote.settings.ping_rate = 3600000;
            remote.settings.local = false;
            test_layout.start_game();
            test_remote.player0.user_id = remote.settings.user_id;
            remote.new_game();
            setTimeout(function(){
                test_remote.player1.user_id = remote.set_user_id();
                remote.join_game();
                resolve('start_game() complete');
            }, (test_remote.animateDelay));
        }); // Promise
    },
}

document.addEventListener("DOMContentLoaded", function(event) {
    console.log('remote.test.js loaded');
    test_remote.test();
});
