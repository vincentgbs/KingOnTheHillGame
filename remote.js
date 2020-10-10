var remote = {
    url: 'http://localhost:8080',
    start_game: function(response) {
        try {
            response = JSON.parse(response);
            controls.player = response.player;
            game.create_board();
            if (response.player < 0) {
                console.debug('The game is already full');
            } else {
                game.game_id = response.game_id;
                game.set_board(response.nop);
                document.querySelector("#game_id").innerHTML = 'Game Id: ' + response.game_id;
            }
        }
        catch(err) {
            console.debug(err);
            console.debug(response);
        }
    },
    start_new_game: function(nop) {
        let request = {
            user_id: remote.user_id,
            action: 'start_new_game',
            player: 0,
            nop: nop,
        };
        remote.xhr.open('POST', remote.url + '/game');
        remote.xhr.onload = function () {
            remote.start_game(remote.xhr.response);
        };
        remote.xhr.send(JSON.stringify(request));
    },
    join_game: function(game_id) {
        let request = {
            user_id: remote.user_id,
            action: 'join_game',
            game_id: game_id,
        }
        remote.xhr.open('POST', remote.url + '/game');
        remote.xhr.onload = function () {
            remote.start_game(remote.xhr.response);
            remote.get_turn(0);
        };
        remote.xhr.send(JSON.stringify(request));
    },
    send_turn: function(turn) {
        let request = {
            user_id: remote.user_id,
            action: 'send_turn',
            game_id: game.game_id,
            player: controls.player,
            turn: JSON.stringify(turn),
        }
        remote.xhr.open('POST', remote.url + '/turn');
        remote.xhr.onload = function () {
            let response = JSON.parse(remote.xhr.response);
            if (response.accepted == 'true') {
                remote.get_turn(0);
            } else {
                console.debug('There was an error');
            }
        };
        remote.xhr.send(JSON.stringify(request));
    },
    get_turn: function(ping) {
        console.log('remote.get_turn');
        let request = {
            user_id: remote.user_id,
            action: 'get_turn',
            game_id: game.game_id,
            player: controls.player,
        }
        remote.xhr.open('POST', remote.url + '/turn');
        remote.xhr.onload = function () {
            let response = JSON.parse(remote.xhr.response);
            setTimeout(function() {
                if (ping < 72) {
                    if (response.waiting == 'true') {
                        remote.get_turn(ping + 1);
                    } else {
                        game.turn = (game.turn+1) % game.settings.no_of_players;
                        game.log.push(response.turn);
                        canvas.animateTurn(response.turn);
                        game.active_turn = {player: game.turn};
                        if (game.turn != controls.player) {
                            remote.get_turn(ping + 1);
                        }
                    }
                } else {
                    console.debug('Opponent turn expired');
                }
            }, 2500);
        };
        remote.xhr.send(JSON.stringify(request));
    },
    user_id: false,
    xhr: new XMLHttpRequest(),
    set_user_id: function() {
        const letters = 'bcdfghjkmnpqrstvwxyz';
        let uid = '';
        for (let i = 0; i < 26; i++) {
            let j = Math.floor(Math.random() * letters.length);
            uid += letters[j];
        }
        return uid;
    },
}

document.addEventListener("DOMContentLoaded", function(event) {
    console.debug('remote.js loaded');
    if (!remote.user_id) {
        remote.user_id = remote.set_user_id();
    }
});
