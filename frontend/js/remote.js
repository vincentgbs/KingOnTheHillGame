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
            current: game.turn.current,
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
            setTimeout(function() {
                return remote.get_turn(0);
            }, remote.settings.ping_rate);
        };
        remote.xhr.send(JSON.stringify(request));
    },
    send_turn: function(turn) {
        let request = remote.create_request('send_turn');
        if (turn) {
            request.turn = JSON.stringify(turn);
        } else {
            request.turn = JSON.stringify(game.turn.active);
        }
        remote.xhr.open('POST', remote.settings.url);
        remote.xhr.onload = function () {
            try {
                let response = JSON.parse(remote.xhr.response);
                if (response.accepted == "true") {
                    remote.get_turn(0);
                } else {
                    console.debug(response);
                }
            } catch(err) {
                console.debug(err);
                console.debug(remote.xhr.response);
            }
        };
        console.debug(request);
        remote.xhr.send(JSON.stringify(request));
    },
    get_turn: function(ping) {
        console.log('remote.get_turn('+ping+')');
        let request = remote.create_request('get_turn');
        remote.xhr.open('POST', remote.settings.url);
        remote.xhr.onload = function () {
            try {
                let response = JSON.parse(remote.xhr.response);
                console.debug(response);
                setTimeout(function() {
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
    window.localStorage.setItem("remote_user_id", remote.set_user_id());
    // if (window.localStorage.getItem('remote_user_id') === null) {
    //     window.localStorage.setItem("remote_user_id", remote.set_user_id());
    // } else { // persistence
    //     remote.user_id = window.localStorage.getItem('remote_user_id');
    // }
});
