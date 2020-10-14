var remote = {
    settings: {
        url: 'http://localhost:8080/koth',
        user_id: '',
        player: 0,
        local: true,
    },
    start_game: function(response) {
        //
    },
    create_request: function(action, pid) {
        return {
            game_id: game.settings.game_id,
            user_id: remote.user_id,
            player: remote.settings.player,
            action: action,
            nop: game.settings.no_of_players,
        };
    },
    new_game: function() {
        let request = remote.create_request('new_game');
        remote.xhr.open('POST', remote.url);
        remote.xhr.onload = function () {
            remote.start_game(remote.xhr.response);
        };
        remote.xhr.send(JSON.stringify(request));
    },
    join_game: function() {
        //
    },
    rejoin_game: function() {
        //
    },
    send_turn: function() {
        //
    },
    get_turn: function() {
        //
    },
    xhr: new XMLHttpRequest(),
    get_url: function() {
        let url = document.querySelector("#remote_url").value;
        if (url !== "") {
            remote.settings.url = url;
        }
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
