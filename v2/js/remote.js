var remote = {
    url: 'http://localhost:8080/koth',
    start_game: function(response) {
        //
    },
    new_game: function() {
        let request = {
            user_id: remote.user_id,
            action: 'start_new_game',
            player: 0,
            nop: nop,
        };
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
    user_id: '',
    local: true,
    xhr: new XMLHttpRequest(),
    get_url: function() {
        let url = document.querySelector("#remote_url").value;
        if (url !== "") {
            remote.url = url;
        }
    },
    set_user_id: function() {
        const letters = 'abcdefghijklmnopqrstuvwxyz';
        for (let i = 0; i < 50; i++) {
            let j = Math.floor(Math.random() * letters.length);
            remote.user_id += letters[j];
        }
        return remote.user_id;
    },
}

document.addEventListener("DOMContentLoaded", function(event) {
    console.log('remote.js (1) loaded');
    if (window.localStorage.getItem('remote_user_id') === null) {
        window.localStorage.setItem("remote_user_id", remote.set_user_id());
    } else { // working on persistence
        remote.user_id = window.localStorage.getItem('remote_user_id');
    }
});
