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
        let p0 = game.players[0];
        let p1 = game.players[1];
        let k0 = p0.pieces[0];
        let p0p1 = p0.pieces[1];
        let p0p2 = p0.pieces[2];
        let k1 = p1.pieces[0];
        let p1p1 = p1.pieces[1];
        let p1p2 = p1.pieces[2];
        // place pieces on board
        game.move(k0, {v:1,h:2});
        game.move(p0p1, {v:1,h:1});
        game.move(p0p2, {v:1,h:3});
        game.move(k1, {v:3,h:2});
        game.move(p1p1, {v:3,h:1});
        game.move(p1p2, {v:3,h:3});
        if (this.objectmatch(k0.location, p0.pieces[0].location) &&
            this.objectmatch(k0.location, game.players[0].pieces[0].location)) {
            return true;
        } else {
            console.debug('Expected locations to match: ');
            console.debug(k0.location);
            console.debug(p0.pieces[0].location);
            console.debug(game.players[0].pieces[0].location);
            return false;
        }
    },
    test6: function() {
        console.debug('Running Unit Test 6');
    }
}

document.addEventListener("DOMContentLoaded", function(event) {
    game.create_board();
    unittests.test1();
    unittests.test2();
    unittests.test3();
    unittests.test4();
    let p = new Promise((resolve, reject) => {
        let a = unittests.test5();
        if (a) {
            resolve('Passed Unit Test 5');
        } else {
            reject('Failed Unit Test 5');
        }
    });
    p.then((message) => {
        console.debug(message);
        unittests.test6();
    }).catch((message) => {
        console.debug(message);
    });
});
