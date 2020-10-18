let controls = {
    get_nop: function() {
        draft.settings.no_of_players = document.querySelector("#no_of_players").value;
    },
    get_nor: function() {
        draft.settings.no_of_rounds = document.querySelector("#no_of_rounds").value;
    },
    start_draft: function() {
        layout.start_draft();
    },
    join_draft: function() {
        remote.join_draft();
    }
}

document.addEventListener("DOMContentLoaded", function(event) {
    console.log('controls.js (3) loaded');
    document.querySelector("#add_boss_button").onclick = layout.add_boss;
});
