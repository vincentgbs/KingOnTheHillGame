var remote = {
    user_id: '',
    url: 'http://localhost:8080/koth',
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
