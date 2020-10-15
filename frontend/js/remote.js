var remote = {
    settings: {
        url: 'http://localhost:8080/koth',
        user_id: '',
        player: 0,
        local: false,
        ping_rate: 2500,
        timeout_x: 50,
    },
    create_request: function(action) {
        return {
            game_id: game.settings.game_id,
            user_id: remote.settings.user_id,
            player: remote.settings.player,
            action: action,
        };
    },
    start_game: function(response) {
        try {
            response = JSON.parse(response);
            if (response.player < 0) {
                layout.flashMessage('The game is already full', 999);
            } else {
                game.settings.game_id = response.game_id;
                game.settings.no_of_players = response.nop;
                remote.settings.player = response.player;
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
            remote.start_game('{"game_id":false,"nop":'+
            game.settings.no_of_players+',"player":0}');
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
            remote.timeout = setTimeout(function() {
                return remote.get_turn(0);
            }, remote.settings.ping_rate);
        };
        remote.xhr.send(JSON.stringify(request));
    },
    send_turn: function(turn) {
        let request = remote.create_request('send_turn');
        request.current = turn.current;
        request.turn = JSON.stringify(turn);
        remote.xhr.open('POST', remote.settings.url);
        remote.xhr.onload = function () {
            try {
                let response = JSON.parse(remote.xhr.response);
                if (response.accepted == "true") {
                    remote.timeout = setTimeout(function() {
                        remote.get_turn(0);
                    }, 2 * remote.settings.ping_rate);
                    return true;
                } else {
                    console.debug(response);
                }
            } catch(err) {
                console.debug(err);
                console.debug(remote.xhr.response);
            }
        };
        remote.xhr.send(JSON.stringify(request));
    },
    get_turn: function(ping) {
        let request = remote.create_request('get_turn');
        request.current = game.get_current_turn();
        console.log('remote.get_turn('+request.current+', '+ping+')');
        remote.xhr.open('POST', remote.settings.url);
        remote.xhr.onload = function () {
            try {
                let response = JSON.parse(remote.xhr.response);
                remote.timeout = setTimeout(function() {
                    if (ping < remote.settings.timeout_x) {
                        if (response.waiting == "true") {
                            return remote.get_turn(ping + 1);
                        } else if (response.turn !== null) {
                            turn = JSON.parse(response.turn);
                            layout.animateTurn(turn);
                        } else {
                            console.debug(response);
                            return false;
                        }
                    } else { // ping >= remote.settings.timeout_x
                        console.debug(response);
                        layout.flashMessage('Opponent turn expired: x' + ping);
                    }
                }, remote.settings.ping_rate);
            } catch(err) {
                console.debug(err);
                console.debug(remote.xhr.response);
            }
        }; // remote.xhr.onload()
        remote.xhr.send(JSON.stringify(request));
    },
    xhr: new XMLHttpRequest(),
    timeout: null, // ping timeout
    get_url: function() {
        let url = document.querySelector("#remote_url").value;
        if (url != "") { remote.settings.url = url; }
        return url;
    },
    get_gid: function() {
        let gid;
        if (document.querySelector("#join_game_id")) {
            gid = document.querySelector("#join_game_id").value;
        } else {
            gid = document.querySelector("#game_id").innerText;
        }
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
