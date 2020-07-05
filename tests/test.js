var unittests = {
    objectmatch: function(arr1, arr2) {
        return (JSON.stringify(arr1) == JSON.stringify(arr2));
    },
    test1: function() {
        if (this.objectmatch(
            game.get_adjacent({v:0, h:0}),
            [{h: 0, v: 1},{h: 1, v: 0},{h: 1, v: 1}])
        ) {
            console.debug('Passed Unit Test 1');
        } else {
            console.debug('Failed Unit Test 1');
            console.debug('Received');
            console.debug(game.get_adjacent({v:0, h:0}));
            console.debug('Expected:');
            console.debug([[0, 1], [1, 0], [1, 1]]);
        }
    },
    test2: function() {
        if (this.objectmatch(
            game.get_adjacent({v:0, h:0}), [])
        ) {
            console.debug('Failed Unit Test 2');
        } else {
            console.debug('Passed Unit Test 2');
        }
    },
    test3: function() {
        if (this.objectmatch(
            game.get_adjacent({v:1, h:1}),
            [{h: 1, v: 2}, {h: 1, v: 0}, {h: 2, v: 1}, {h: 2, v: 2}, {h: 2, v: 0}, {h: 0, v: 1}, {h: 0, v: 2}, {h: 0, v: 0}])
        ) {
            console.debug('Passed Unit Test 3');
        } else {
            console.debug('Failed Unit Test 3');
            console.debug('Received');
            console.debug(game.get_adjacent({v:1, h:1}));
            console.debug('Expected:');
            console.debug([[1, 2], [1, 0], [2, 1], [2, 2], [2, 0], [0, 1], [0, 2], [0, 0]]);
        }
    },
    test4: function() {
        if (this.objectmatch(
            game.get_adjacent({v:1, h:1}), [])
        ) {
            console.debug('Failed Unit Test 4');
        } else {
            console.debug('Passed Unit Test 4');
        }
    },
    test5: function() {
        // create labels
        let p1 = game.players[0];
        let p2 = game.players[1];
        let k1 = p1.pieces[0];
        let p1p1 = p1.pieces[1];
        let p1p2 = p1.pieces[2];
        let k2 = p2.pieces[0];
        let p2p1 = p2.pieces[1];
        let p2p2 = p2.pieces[2];
        // place pieces on board
        game.move(k1, {v:1,h:2});
        game.move(p1p1, {v:1,h:1});
        game.move(p1p2, {v:1,h:3});
        game.move(k2, {v:3,h:2});
        game.move(p2p1, {v:3,h:1});
        game.move(p2p2, {v:3,h:3});
        console.debug('Passed Unit Test 5');
    }
}

document.addEventListener("DOMContentLoaded", function(event) {
    game.create_board();
    unittests.test1();
    unittests.test2();
    unittests.test3();
    unittests.test4();
    unittests.test5();
});
