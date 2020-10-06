var remote = {
    url: 'http://localhost:8080',
    start_game: function(response) {
        try {
            response = JSON.parse(response);
            game.game_id = response.game_id;
            controls.player = response.player;
            game.create_board();
            game.set_board(response.nop);
            document.querySelector("#game_id").innerHTML = 'Game Id: ' + response.game_id;
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
            console.debug(remote.xhr.response);
        };
        console.debug(request);
        remote.xhr.send(JSON.stringify(request));
    },
    get_turn: function() {
        let request = {
            user_id: remote.user_id,
            action: 'send_turn',
            game_id: game.game_id,
            player: controls.player,
        }
        let ping = 0;
        while(ping < 72) {
            setTimeout(function() {
                ping++;
            }, 2500);
        }
    },
    user_id: 'set_user_id',
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
    remote.user_id = remote.set_user_id();
});
