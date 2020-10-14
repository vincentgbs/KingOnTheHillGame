let test_remote = {
    player0: function(index) {
        let turn = test_layout.build(test_game.demo0[index]);
        remote.send_turn(turn);
    },
    player1: function(index) {
        let turn = test_layout.build(test_game.demo1[index]);
        remote.send_turn(turn);
    }
}

document.addEventListener("DOMContentLoaded", function(event) {
    console.log('remote.test.js loaded');
});
