let controls = {
    get_nop: function() {
        draft.settings.no_of_players = document.querySelector("#no_of_players").value;
    },
    start_draft: function() {
        layout.start_draft();
    },
    join_draft: function() {
        console.debug('join draft');
    }
}

document.addEventListener("DOMContentLoaded", function(event) {
    console.log('controls.js (3) loaded');
    document.querySelector("#add_boss_button").onclick = layout.add_boss;
});
