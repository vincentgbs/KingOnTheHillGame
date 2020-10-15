let test_remote = {
    animateDelay: 999,
    player0: {
        user_id: null,
        send_player0: function(index) {
            remote.settings.user_id = test_remote.player0.user_id;
            remote.settings.player = 0;
            let turn = test_layout.build(test_game.demo0[index]);
            remote.send_turn(turn);
        },
        get_player0: function() {
            remote.settings.user_id = remote.player0.user_id;
            remote.settings.player = 0;
        },
    },
    player1: {
        user_id: null,
        send_player1: function(index) {
            remote.settings.user_id = test_remote.player1.user_id;
            remote.settings.player = 1;
            let turn = test_layout.build(test_game.demo1[index]);
            remote.send_turn(turn);
        },
        get_player1: function() {
            remote.settings.user_id = remote.player1.user_id;
            remote.settings.player = 1;

        },
    },
    test: function() {
        test_remote.start_game();
        setTimeout(function() {
            test_remote.player0.send_player0(0);
            setTimeout(function() {
                //
            }, (5 * test_remote.animateDelay));
        }, test_remote.animateDelay);
    },
    start_game: function() {
        remote.settings.local = false;
        test_layout.start_game();
        test_remote.player0.user_id = remote.settings.user_id;
        remote.new_game();
        setTimeout(function(){
            test_remote.player1.user_id = remote.set_user_id();
            remote.join_game();
        }, (5 * test_remote.animateDelay));
    },
}

document.addEventListener("DOMContentLoaded", function(event) {
    console.log('remote.test.js loaded');
    test_remote.test();
});
