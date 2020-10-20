let controls = {
    get_nop: function() {
        draft.settings.no_of_players = document.querySelector("#no_of_players").value;
    },
    get_nor: function() {
        draft.settings.no_of_rounds = document.querySelector("#no_of_rounds").value;
    },
    make_pick: function() {
        if (remote.settings.player == draft.get_player_from_turn(draft.turn)) {
            let pick = document.querySelector("#make_pick").value;
            remote.send_pick(pick);
        } else {
            console.log("It's not your turn");
        }
    },
    start_draft: function() {
        remote.start_draft();
    },
    new_draft: function() {
        remote.new_draft();
    },
    join_draft: function() {
        remote.join_draft();
    }
}

document.addEventListener("DOMContentLoaded", function(event) {
    console.log('controls.js (3) loaded');
    document.querySelector("#add_boss_button").onclick = layout.add_boss;
});
