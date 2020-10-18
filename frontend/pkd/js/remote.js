var remote = {
    settings: {
        url: 'http://localhost:8080/pkd-actions',
        user_id: '',
        player: 0,
        ping_rate: 2500,
        timeout_x: 50,
    },
    create_request: function(action) {
        return {
            draft_id: draft.settings.draft_id,
            user_id: remote.settings.user_id,
            player: remote.settings.player,
            action: action,
        };
    },
    new_game: function() {
        let request = remote.create_request('new_game');
        request.nop = draft.settings.no_of_players;
        remote.xhr.open('POST', remote.settings.url);
        remote.xhr.onload = function () {
            remote.start_game(remote.xhr.response);
        };
        try {
            remote.xhr.send(JSON.stringify(request));
        } catch (err) {
            console.debug(err);
            layout.flashMessage('Error connecting to server', 9999);
        }
    },
    send_request: function(request) {
        if (remote.settings.local) { return false; }
        try {
            remote.xhr.onerror = function() {
                layout.flashMessage('Error connecting to server', 9999);
                remote.slow_ping_rate();
            }
            remote.xhr.send(JSON.stringify(request));
        } catch (err) {
            console.debug(err);
            console.debug(request);
        }
    },
    slow_ping_rate: function() {
        if (remote.settings.ping_rate < 3600000) { // max 1 hour
            remote.settings.ping_rate *= 2; // slow ping rate
            if (remote.settings.ping_rate < 600000) { // 10 min
                remote.settings.ping_rate *= 2; // slow ping rate more
            }
            if (remote.settings.ping_rate > 3600000) { // max 1 hour
                remote.settings.ping_rate = 3600000; // 1 hour
            }
        }
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
});
