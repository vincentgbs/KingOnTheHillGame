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
    start_draft: function(response) {
        try {
            response = JSON.parse(response);
            if (response.player < 0) {
                layout.flashMessage('The draft is already full', 999);
            } else {
                draft.settings.draft_id = response.draft_id;
                draft.settings.no_of_players = response.nop;
                remote.settings.player = response.player;
                draft.settings.bosses = JSON.parse(response.bosses);
                layout.create_draft(response.player);
            }
        } catch(err) {
            console.debug(err);
            console.debug(response);
        }
    },
    new_draft: function() {
        if (draft.settings.bosses.length > 0) {
            let request = remote.create_request('new_draft');
            request.nop = draft.settings.no_of_players;
            request.bosses = JSON.stringify(draft.settings.bosses);
            remote.xhr.open('POST', remote.settings.url);
            remote.xhr.onload = function () {
                remote.start_draft(remote.xhr.response);
            };
            try {
                remote.send_request(request);
            } catch (err) {
                console.debug(err);
                layout.flashMessage('Error connecting to server', 9999);
            }
        } else {
            layout.flashMessage('Add bosses before creating draft', 999);
        }
    },
    join_draft: function() {
        let request = remote.create_request('join_draft');
        request.draft_id = remote.get_did();
        remote.xhr.open('POST', remote.settings.url);
        remote.xhr.onload = function () {
            remote.start_draft(remote.xhr.response);
        };
        try {
            remote.send_request(request);
        } catch (err) {
            console.debug(err);
            layout.flashMessage('Error connecting to server', 9999);
        }
    },
    get_options: function() {
        //
    },
    xhr: new XMLHttpRequest(),
    timeout: null, // ping timeout
    send_request: function(request) {
        // console.debug(request);
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
    get_did: function() {
        let did;
        if (document.querySelector("#join_draft_id")) {
            did = document.querySelector("#join_draft_id").value;
        } else {
            did = document.querySelector("#draft_id").innerText;
        }
        if (did != "") { draft.settings.draft_id = did; }
        return did;
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
    console.log('remote.js (1) loaded');
    if (window.localStorage.getItem('remote_user_id') === null) {
        window.localStorage.setItem("remote_user_id", remote.set_user_id());
    } else { // persistence
        remote.settings.user_id = window.localStorage.getItem('remote_user_id');
    }
});
