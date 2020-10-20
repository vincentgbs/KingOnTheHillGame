var remote = {
    settings: {
        url: 'http://localhost:8080/pkd-actions',
        user_id: '',
        player: 0,
        ping_rate: 2500,
        timeout_x: 50,
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
