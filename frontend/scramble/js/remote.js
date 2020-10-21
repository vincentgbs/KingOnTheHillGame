var remote = {
    settings: {
        url: 'scramble-actions',
        user_id: '',
        player: 0,
        ping_rate: 100,
        max_send_moves: 100,
        max_send_eggs: 10,
    },
    create_request: function(action) {
        return {
            game_id: game.settings.game_id,
            user_id: remote.settings.user_id,
            player: remote.settings.player,
            action: action,
        };
    },
    create_game: function(response) {
        try {
            response = JSON.parse(response);
            if (response.player < 0) {
                layout.flashMessage('The game is already full', 999);
            } else {
                game.settings.game_id = response.game_id;
                game.settings.no_of_players = response.nop;
                remote.settings.player = response.player;
                game.create_game();
                layout.game_options();
            }
        } catch(err) {
            console.debug(err);
            console.debug(response);
        }
    },
    new_game: function() {
        let request = remote.create_request('new_game');
        request.nop = game.settings.no_of_players;
        remote.xhr.open('POST', remote.settings.url);
        remote.xhr.onload = function () {
            remote.create_game(remote.xhr.response);
        };
        try {
            remote.xhr.send(JSON.stringify(request));
        } catch (err) {
            console.debug(err);
            layout.flashMessage('Error connecting to server', 9999);
        }
    },
    join_game: function() {
        return new Promise(resolve => {
            let request = remote.create_request('join_game');
            request.game_id = remote.get_gid();
            remote.xhr.open('POST', remote.settings.url);
            remote.xhr.onload = function () {
                try {
                    remote.create_game(remote.xhr.response);
                    resolve(JSON.parse(remote.xhr.response));
                } catch (err) {
                    console.debug(err);
                    console.debug(remote.xhr.response);
                }
            };
            remote.send_request(request);
        }); // Promise
    },
    start_game: function() {
        return new Promise(resolve => {
            let request = remote.create_request('start_game');
            remote.xhr.open('POST', remote.settings.url);
            remote.xhr.onload = function () {
                try {
                    resolve(JSON.parse(remote.xhr.response));
                } catch (err) {
                    console.debug(err);
                    console.debug(remote.xhr.response);
                }
            };
            remote.send_request(request);
        }); // Promise
    },
    send_moves: function(attempts) {
        if (attempts > remote.settings.max_send_moves) {return false;}
        let request = remote.create_request('send_moves');
        request.location = JSON.stringify(game.players[remote.settings.player].location);
        remote.xhr.open('POST', remote.settings.url);
        remote.xhr.onload = function () {
            try {
                let response = JSON.parse(remote.xhr.response);
                if (!response.accepted) {
                    remote.send_moves(attempts+1);
                }
            } catch (err) {
                console.debug(err);
                console.debug(remote.xhr.response);
            }
        };
        remote.send_request(request);
    },
    send_egg: function(attempts) {
        if (attempts > remote.settings.max_send_eggs) {return false;}
        let request = remote.create_request('send_egg');
        let eggs = game.players[remote.settings.player].eggs;
        let last_egg = eggs[eggs.length - 1];
        request.eggs = JSON.stringify(last_egg);
        remote.xhr.open('POST', remote.settings.url);
        remote.xhr.onload = function () {
            try {
                let response = JSON.parse(remote.xhr.response);
                if (!response.accepted) {
                    remote.send_egg(attempts+1);
                }
            } catch (err) {
                console.debug(err);
                console.debug(remote.xhr.response);
            }
        };
        remote.send_request(request);
    },
    get_moves: function() {
        let request = remote.create_request('get_moves');
        remote.xhr.open('POST', remote.settings.url);
        remote.xhr.onload = function () {
            try {
                let response = JSON.parse(remote.xhr.response);
                remote.move_players(response.locations);
            } catch (err) {
                console.debug(err);
                console.debug(remote.xhr.response);
            }
        };
        remote.send_request(request);
    },
    get_eggs: function() {
        let request = remote.create_request('get_eggs');
        remote.xhr.open('POST', remote.settings.url);
        remote.xhr.onload = function () {
            try {
                let response = JSON.parse(remote.xhr.response);
                remote.place_eggs(response.eggs);
            } catch (err) {
                console.debug(err);
                console.debug(remote.xhr.response);
            }
        };
        remote.send_request(request);
    },
    move_players: function(remote_locations) {
        for(let i = 0; i < remote_locations.length; i++) {
            if (remote_locations[i] != null) {
                let index = response.locations[i][0];
                game.players[index].location = JSON.parse(remote_locations[i][1]);
            }
        }
    },
    place_eggs: function(remote_eggs) {
        for(let i = 0; i < remote_eggs.length; i++) {
            if (remote_eggs[i] != null) {
                let index = remote_eggs[i][0];
                let egg = JSON.parse(remote_eggs[i][1]);
                // game.players[index].drop_egg();
            }
        }
    },
    send_and_get_moves: function() {
        //
    },
    xhr: new XMLHttpRequest(),
    send_request: function(request) {
        try {
            remote.xhr.onerror = function() {
                layout.flashMessage('Error connecting to server', 9999);
            }
            remote.xhr.send(JSON.stringify(request));
        } catch (err) {
            console.debug(err);
            console.debug(request);
        }
    },
    get_domain: function() {
        let url = window.location.href; // get base domain
        remote.settings.url = (url.substring(0, url.length-19) + 'scramble-actions');
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
        remote.settings.user_id = '';
        for (let i = 0; i < 50; i++) {
            let j = Math.floor(Math.random() * letters.length);
            remote.settings.user_id += letters[j];
        }
        return remote.settings.user_id;
    },
}

document.addEventListener("DOMContentLoaded", function(event) {
    console.log('remote.js (2) loaded');
    if (window.localStorage.getItem('remote_user_id') === null) {
        window.localStorage.setItem("remote_user_id", remote.set_user_id());
    } else { // persistence
        remote.settings.user_id = window.localStorage.getItem('remote_user_id');
    }
    remote.get_domain();
    // setInterval(remote.send_and_get_moves, remote.settings.ping_rate);
});
