var unittests = {
    delay: 999,
    objectmatch: function(arr1, arr2) {
        return (JSON.stringify(arr1) == JSON.stringify(arr2));
    },
    test1: function() {
        if (this.objectmatch(
            game.get_adjacent({v:0, h:0}),
            [{v: 0, h: 1},{v: 1, h: 0},{v: 1, h: 1}])
        ) {
            console.debug('Passed Unit Test 1');
        } else {
            console.debug('Failed Unit Test 1');
            console.debug('Received');
            console.debug(game.get_adjacent({v:0, h:0}));
            console.debug('Expected:');
            console.debug([{v: 0, h: 1},{v: 1, h: 0},{v: 1, h: 1}]);

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
            [{v: 1, h: 0},{v: 1, h: 2},{v: 0, h: 1},{v: 0, h: 0},{v: 0, h: 2},{v: 2, h: 1},{v: 2, h: 0},{v: 2, h: 2}])
        ) {
            console.debug('Passed Unit Test 3');
        } else {
            console.debug('Failed Unit Test 3');
            console.debug('Received');
            console.debug(game.get_adjacent({v:1, h:1}));
            console.debug('Expected:');
            console.debug([{v: 1, h: 0},{v: 1, h: 2},{v: 0, h: 1},{v: 0, h: 0},{v: 0, h: 2},{v: 2, h: 1},{v: 2, h: 0},{v: 2, h: 2}]);


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
        let p0p1 = game.players[0].pieces[1];
        let o = game.get_adjacent(p0p1.location);
        let p = game.filter_move(o, p0p1);
        if (this.objectmatch(o, p)) {
            console.debug('Should not be able to move where another piece is');
            return false;
        } else {
            if (this.objectmatch(p, [])) {
                return true;
            } else {
                return false;
            }
        }
    },
    test7: function() {
        let p0p1 = game.players[0].pieces[1];
        let p = new Promise((resolve, reject) => {
            if (p0p1.location.v == 1 && p0p1.location.h == 1) {
                resolve('Starting at: {v:1, h:1}');
            } else {
                console.debug(p0p1.location);
                reject('Incorrect Starting Location');
            }
        });
        return p.then((message) => {
            let p0p1 = game.players[0].pieces[1];
            let o = game.filter_move(game.get_adjacent(p0p1.location), p0p1);
            let p = new Promise((resolve, reject) => {
                let a = game.move(p0p1, o[0]);
                if (p0p1.location.v == 2 && p0p1.location.h == 1) {
                    resolve('Moved to: {v:2, h:1}');
                } else {
                    console.debug(p0p1.location)
                    reject('Did not move correctly');
                }
            });
            return p.then((message) => {
                return true;
            }).catch((message) => {
                console.debug(message);
                return false;
            });
        }).catch((message) => {
            console.debug(message);
        });
    },
    test8: function() {
        let p0p1 = game.players[0].pieces[1];
        let o = game.get_adjacent(p0p1.location);
        let p = game.filter_build(o, p0p1);
        if (this.objectmatch(o, p)) {
            console.debug('Should not be able to build where another piece is');
            return false;
        } else {
            if (this.objectmatch(p, [{h:1,v:1},{h:2,v:2},
                {h:0,v:2},{h:0,v:3},{h:0,v:1}])) {
                return true;
            } else {
                console.debug(o, p);
                return false;
            }
        }
    },
    test9: function() {
        let p0p1 = game.players[0].pieces[1];
        let o = game.filter_build(game.get_adjacent(p0p1.location), p0p1);
        if (game.board[o[0].v][o[0].h].level !== 0) {
            return false;
        } else {
            let p = new Promise((resolve, reject) => {
                game.build(o[0]);
                if (game.board[o[0].v][o[0].h].level === 1) {
                    resolve('Build successful (Test 9)');
                } else {
                    reject('Build failed (Test 9)');
                }
            });
            return p.then((message) => {
                console.debug(message);
                return true;
            }).catch((message) => {
                console.debug(message);
                return false;
            });
        }
    },
    test10: function() {
        // reset game
        game.board[1][1].level = 0;
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
        setTimeout(function() {
            let p = new Promise((resolve, reject) => {
                let a = unittests.test6();
                if (a) {
                    resolve('Passed Unit Test 6');
                } else {
                    reject('Failed Unit Test 6');
                }
            });
            p.then((message) => {
                console.debug(message);
                let p = new Promise((resolve, reject) => {
                    let a = unittests.test7();
                    if (a) {
                        resolve('Passed Unit Test 7');
                    } else {
                        reject('Failed Unit Test 7');
                    }
                });
                p.then((message) => {
                    console.debug(message);
                    let p = new Promise((resolve, reject) => {
                        let a = unittests.test8();
                        if (a) {
                            resolve('Passed Unit Test 8');
                        } else {
                            reject('Failed Unit Test 8');
                        }
                    });
                    p.then((message) => {
                        console.debug(message);
                        setTimeout(function() {
                            let p = new Promise((resolve, reject) => {
                                let a = unittests.test9();
                                if (a) {
                                    resolve('Passed Unit Test 9');
                                } else {
                                    reject('Failed Unit Test 9');
                                }
                            });
                            p.then((message) => {
                                // console.debug(message);
                            }).catch((message) => {
                                // console.debug(message);
                            });
                        }, unittests.delay);
                    }).catch((message) => {
                        console.debug(message);
                    });
                }).catch((message) => {
                    console.debug(message);
                });
            }).catch((message) => {
                console.debug(message);
            });
        }, unittests.delay);
    }).catch((message) => {
        console.debug(message);
    });

    setTimeout(function() {
        unittests.test10();
    }, 5000);

});
