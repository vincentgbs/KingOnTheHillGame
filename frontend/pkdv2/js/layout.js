let layout = {
    flashMessage: function(message, time) {
        let div = document.querySelector("#flash_message");
        div.innerText = message;
        div.style.display = 'block';
        setTimeout(function() {
            div.innerText = '';
            div.style.display = 'none';
        }, time);
    },
}

document.addEventListener("DOMContentLoaded", function(event) {
    console.log('layout.js (2) loaded');
});
