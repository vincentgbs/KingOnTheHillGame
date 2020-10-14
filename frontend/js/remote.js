var remote = {
    settings: {
        url: 'http://localhost:8080/koth',
        user_id: '',
        player: 0,
        local: true,
    },
    create_request: function(action) {
        return {
            game_id: game.settings.game_id,
            user_id: remote.user_id,
            player: remote.settings.player,
            action: action,
        };
    },
    start_game: function(response) {
        try {
            response = JSON.parse(response);
            console.debug(response);
            if (response.player < 0) {
                layout.flashMessage('The game is already full', 999);
            } else {
                game.settings.game_id = response.game_id;
                game.settings.no_of_players = response.nop;
                game.start_game();
                layout.start_game();
                layout.render();
            }
        } catch(err) {
            console.debug(err);
            console.debug(response);
        }
    },
    new_game: function() {
        if (remote.settings.local) {
            remote.start_game('{"game_id":false,"nop":'+game.settings.no_of_players+'}');
        } else {
            let request = remote.create_request('new_game');
            request.nop = game.settings.no_of_players;
            remote.xhr.open('POST', remote.settings.url);
            remote.xhr.onload = function () {
                remote.start_game(remote.xhr.response);
            };
            remote.xhr.send(JSON.stringify(request));
        }
    },
    join_game: function() {
        let request = remote.create_request('join_game');
        request.game_id = remote.get_gid();
        remote.xhr.open('POST', remote.settings.url);
        remote.xhr.onload = function () {
            remote.start_game(remote.xhr.response);
        };
        // console.debug(JSON.stringify(request));
        remote.xhr.send(JSON.stringify(request));
    },
    rejoin_game: function() {
        let request = remote.create_request('rejoin_game');
        remote.xhr.open('POST', remote.settings.url);
        remote.xhr.onload = function () {
            remote.start_game(remote.xhr.response);
        };
        console.debug(JSON.stringify(request));
    },
    send_turn: function() {
        let request = remote.create_request('send_turn');
    },
    get_turn: function() {
        let request = remote.create_request('get_turn');
    },
    xhr: new XMLHttpRequest(),
    get_url: function() {
        let url = document.querySelector("#remote_url").value;
        if (url != "") { remote.settings.url = url; }
        return url;
    },
    get_gid: function() {
        let gid = document.querySelector("#join_game_id").value;
        if (gid != "") { game.settings.game_id = gid; }
        return gid;
    },
    set_user_id: function() {
        const letters = 'abcdefghijklmnopqrstuvwxyz';
        for (let i = 0; i < 50; i++) {
            let j = Math.floor(Math.random() * letters.length);
            remote.settings.user_id += letters[j];
        }
        return remote.settings.user_id;
    },
}

document.addEventListener("DOMContentLoaded", function(event) {
    console.log('remote.js (1) loaded');
    if (window.localStorage.getItem('remote_user_id') === null) {
        window.localStorage.setItem("remote_user_id", remote.set_user_id());
    } else { // persistence
        remote.user_id = window.localStorage.getItem('remote_user_id');
    }
});
