var remote = {
    settings: {
        url: 'scramble-actions',
        user_id: '',
        player: 0,
        ping_rate: 250,
        max_send_moves: 3,
        max_send_eggs: 1,
        refresh: null, // setInterval
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
                remote.settings.refresh = setInterval(remote.send_and_get_moves, remote.settings.ping_rate);
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
    send_moves: function() {
        let request = remote.create_request('send_moves');
        request.location = JSON.stringify(game.players[remote.settings.player].location);
        remote.xhr.open('POST', remote.settings.url);
        remote.send_request(request);
    },
    send_egg: function() {
        let request = remote.create_request('send_egg');
        let eggs = game.players[remote.settings.player].eggs;
        let last_egg = eggs[eggs.length - 1];
        request.eggs = JSON.stringify(last_egg);
        remote.xhr.open('POST', remote.settings.url);
        remote.send_request(request);
    },
    get_moves: function() {
        let request = remote.create_request('get_moves');
        let xhr = new XMLHttpRequest(); // avoid conflicts
        xhr.open('POST', remote.settings.url);
        xhr.onload = function () {
            try {
                let response = JSON.parse(xhr.response);
                if (response.last_check > 0) {
                    controls.start_game();
                }
                if (response.locations) {
                    remote.move_players(response.locations);
                }
                if (response.eggs) {
                    remote.place_eggs(response.eggs);
                }
            } catch (err) {
                console.debug(err);
                console.debug(remote.xhr.response);
            }
        };
        xhr.onerror = function() {
            layout.flashMessage('Error connecting to server', 9999);
        }
        try {
            xhr.send(JSON.stringify(request));
        } catch (err) {
            console.debug(err);
            console.debug(remote.xhr.response);
        }
    },
    move_players: function(remote_locations) {
        for(let i = 0; i < remote_locations.length; i++) {
            if (remote_locations[i] != null) {
                let pid = remote_locations[i][0];
                if (remote.settings.player != pid) {
                    game.players[pid].location = JSON.parse(remote_locations[i][1]);
                }
            }
        }
    },
    place_eggs: function(remote_eggs) {
        for(let i = 0; i < remote_eggs.length; i++) {
            if (remote_eggs[i] != null) {
                let pid = remote_eggs[i][0];
                let egg = JSON.parse(remote_eggs[i][1]);
                if (remote.settings.player != pid) {
                    game.players[pid].drop_egg(egg.location, egg.index);
                }
            }
        }
    },
    send_and_get_moves: function() {
        remote.send_moves();
        remote.get_moves();
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
});
