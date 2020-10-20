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
    create_draft: function(response) {
        try {
            response = JSON.parse(response);
            if (response.player < 0) {
                layout.flashMessage('The draft is already full', 999);
            } else {
                draft.settings.draft_id = response.draft_id;
                draft.settings.no_of_players = response.nop;
                remote.settings.player = response.player;
                if (draft.create_draft(JSON.parse(response.bosses))) {
                    remote.get_options();
                    layout.create_draft(response.player);
                    layout.create_start_button();
                }
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
                remote.create_draft(remote.xhr.response);
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
            remote.create_draft(remote.xhr.response);
        };
        try {
            remote.send_request(request);
        } catch (err) {
            console.debug(err);
            layout.flashMessage('Error connecting to server', 9999);
        }
    },
    start_draft: function() {
        let request = remote.create_request('start_draft');
        remote.xhr.open('POST', remote.settings.url);
        remote.xhr.onload = function () {
            let response = JSON.parse(remote.xhr.response);
            if (response.accepted == 'true') {
                timer.startTimer();
            } else {
                layout.flashMessage('Waiting on players to join draft', 999);
            }
        };
        try {
            remote.send_request(request);
        } catch (err) {
            console.debug(err);
            layout.flashMessage('Error connecting to server', 9999);
        }
    },
    get_options: function() {
        let request = remote.create_request('get_options');
        remote.xhr.open('POST', remote.settings.url);
        remote.xhr.onload = function () {
            let response = JSON.parse(remote.xhr.response);
            for (let i = 0; i < response.length; i++) {
                let opt = response[i];
                draft.options.push(draft.create_option(opt[0], opt[1]));
            }
        }
        remote.send_request(request);
    },
    send_pick: function(pick) {
        let request = remote.create_request('send_pick');
        request.pick = pick;
        request.pick_number = draft.turn;
        remote.xhr.open('POST', remote.settings.url);
        remote.xhr.onload = function () {
            let response = JSON.parse(remote.xhr.response);
            if (response.accepted) {
                console.debug('response accepted');
            } else {
                layout.flashMessage('Draft has not started', 999);
            }
        }
        remote.send_request(request);
    },
    get_picks: function() {
        let request = remote.create_request('get_picks');
        remote.xhr.open('POST', remote.settings.url);
        remote.xhr.onload = function () {
            let response = JSON.parse(remote.xhr.response);
            for (let i = 0; i < response.picks.length; i++) {
                response.picks[0]; // pick_number
                response.picks[1]; // player
                response.picks[3]; // pokemon
                // Need to sort and add to players
                console.debug(response);
            }
        }
        remote.send_request(request);
    },
    xhr: new XMLHttpRequest(),
    timeout: null, // ping timeout
    send_request: function(request) {
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
