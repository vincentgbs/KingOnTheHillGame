let test_remote = {
    animateDelay: 5000,
    player0: {
        user_id: null,
        current: null,
        send_turn: function(index) {
            remote.settings.user_id = test_remote.player0.user_id;
            remote.settings.player = 0;
            let turn = test_remote.build(test_game.demo0[index]);
            turn.current = test_remote.player0.current;
            remote.send_turn(turn);
            setTimeout(function() {
                test_remote.player0.current++;
            }, 999);
        },
        get_turn: function() {
            remote.settings.user_id = remote.player0.user_id;
            remote.settings.player = 0;
            remote.get_turn(40);
        },
    },
    player1: {
        user_id: null,
        current: null,
        send_turn: function(index) {
            remote.settings.user_id = test_remote.player1.user_id;
            remote.settings.player = 1;
            let turn = test_remote.build(test_game.demo1[index]);
            turn.current = test_remote.player1.current;
            remote.send_turn(turn);
            setTimeout(function() {
                test_remote.player1.current++;
            }, 999);
        },
        get_turn: function() {
            remote.settings.user_id = remote.player1.user_id;
            remote.settings.player = 1;
            remote.get_turn(40);
        },
    },
    test: async function() {
        let response = await test_remote.start_game();
        console.log(response);
        setTimeout(function() { // test_remote.player0.send_turn(0)
            test_remote.player0.send_turn(0);
            test_remote.clearPingTimeout();
            setTimeout(function() { // test_remote.player1.send_turn(0);
                test_remote.player1.send_turn(0);
                test_remote.clearPingTimeout();
                setTimeout(function() { // test_remote.player0.send_turn(1)
                    test_remote.player0.send_turn(1);
                    test_remote.clearPingTimeout();
                    setTimeout(function() { // test_remote.player1.send_turn(1);
                        test_remote.player1.send_turn(1);
                        test_remote.clearPingTimeout();
                        setTimeout(function() { // test_remote.player0.send_turn(2)
                            test_remote.player0.send_turn(2);
                            test_remote.clearPingTimeout();
                            setTimeout(function() { // test_remote.player1.send_turn(2);
                                test_remote.player1.send_turn(2);
                                test_remote.clearPingTimeout();
                                setTimeout(function() { // test_remote.player0.send_turn(3)
                                    test_remote.player0.send_turn(3);
                                    test_remote.clearPingTimeout();
                                    setTimeout(function() { // test_remote.player1.send_turn(3);
                                        test_remote.player1.send_turn(3);
                                        test_remote.clearPingTimeout();
                                    }, (test_remote.animateDelay)); // test_remote.player1.send_turn(3);
                                }, test_remote.animateDelay); // test_remote.player0.send_turn(3)
                            }, (test_remote.animateDelay)); // test_remote.player1.send_turn(2);
                        }, test_remote.animateDelay); // test_remote.player0.send_turn(2)
                    }, (test_remote.animateDelay)); // test_remote.player1.send_turn(1);
                }, test_remote.animateDelay); // test_remote.player0.send_turn(1)
            }, (test_remote.animateDelay)); // test_remote.player1.send_turn(0);
        }, test_remote.animateDelay); // test_remote.player0.send_turn(0)
    },
    build: function(object, current) {
        let turn = game.create_turn(object[0]);
        turn.from = game.create_location(object[1][0], object[1][1]);
        turn.to = game.create_location(object[2][0], object[2][1]);
        turn.build = game.create_location(object[3][0], object[3][1]);
        turn.current = current;
        return turn;
    },
    start_game: async function() {
        return new Promise(resolve => {
            remote.settings.local = false;
            test_layout.start_game();
            test_remote.player0.user_id = remote.settings.user_id;
            remote.new_game();
            setTimeout(function(){
                test_remote.player1.user_id = remote.set_user_id();
                remote.join_game();
                resolve('test_remote.start_game() complete');
            }, (test_remote.animateDelay));
        }); // Promise
    },
    clearPingTimeout: function() {
        clearTimeout(remote.timeout);
        clearTimeout(remote.timeout);
        clearTimeout(remote.timeout);
        setTimeout(function() {
            clearTimeout(remote.timeout);
            clearTimeout(remote.timeout);
            clearTimeout(remote.timeout);
            setTimeout(function() {
                clearTimeout(remote.timeout);
                clearTimeout(remote.timeout);
                clearTimeout(remote.timeout);
                setTimeout(function() {
                    clearTimeout(remote.timeout);
                    clearTimeout(remote.timeout);
                    clearTimeout(remote.timeout);
                    setTimeout(function() {
                        clearTimeout(remote.timeout);
                        clearTimeout(remote.timeout);
                        clearTimeout(remote.timeout);
                        setTimeout(function() {
                            clearTimeout(remote.timeout);
                            clearTimeout(remote.timeout);
                            clearTimeout(remote.timeout);
                            setTimeout(function() {
                                clearTimeout(remote.timeout);
                                clearTimeout(remote.timeout);
                                clearTimeout(remote.timeout);
                            }, 10);
                        }, 10);
                    }, 10);
                }, 1);
            }, 1);
        }, 1);
    },
}

document.addEventListener("DOMContentLoaded", function(event) {
    console.log('remote.test.js loaded');
    test_remote.test();
});
