var remote = {
    url: 'http://localhost:8080',
    start_new_game: function(nop) {
        let new_game = {
            user_id: remote.user_id,
            action: 'start_new_game',
            player: 0,
        };
        remote.xhr.open('POST', remote.url);
        remote.xhr.onload = function () {
            response = JSON.parse(remote.xhr.response);
            console.debug(response);
            game.game_id = response.game_id;
            controls.player = response.player;
            game.create_board();
            game.set_board(nop);
            document.querySelector("#game_id").innerHTML = 'Game Id: ' + response.game_id;
        };
        remote.xhr.send(JSON.stringify(new_game));
        return game.game_id;
    },
    join_game: function(game_id) {
        let join_game = {
            user_id: remote.user_id,
            action: 'join_game',
            game_id: game_id,
        }
        remote.xhr.open('POST', remote.url);
        remote.xhr.onload = function () {
            response = JSON.parse(remote.xhr.response);
            game.game_id = response.game_id;
            controls.player = response.player;
            game.create_board();
            game.set_board(response.nop);
            document.querySelector("#game_id").innerHTML = 'Game Id: ' + response.game_id;
        };
        remote.xhr.send(JSON.stringify(join_game));
    },
    send_turn: function(json) {
        //
    },
    get_turn: function(game_id) {
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
