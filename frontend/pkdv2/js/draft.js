let draft = {
    settings: {
        draft_id: false,
        no_of_players: 2,
        no_of_rounds: 6,
        bosses: [],
        max_time: false,
        created: false,
        started: false,
    },
    players: [],
    picks: [],
    options: [{index:0, name:'', status: false, data: null}], // index 0
    turn: 0,
    get_player_from_turn: function(turn) {
        let round = Math.floor((turn)/draft.settings.no_of_players);
        if (round > draft.settings.no_of_rounds) {
            return false; // draft is over
        } // else
        if ((round%2)==1) { // odd
            return (draft.settings.no_of_players - ((turn%draft.settings.no_of_players)+1));
        } else { // even
            return (turn % draft.settings.no_of_players);
        }
    },
    create_option: function(i, name, data) {
        return {
            index: i,
            name: name,
            status: 'available',
            data: data, // json
        };
    },
    create_player: function(pid) {
        return {
            pid: pid,
            picks: [],
            username: false,
            display_player: function() {
                if (this.username) {
                    return this.username;
                } // else
                return 'Player ' + (this.pid+1);
            },
        };
    },
    add_boss: function(boss) {
        if (draft.settings.created) {
            return console.log('Draft already created'); // null
        } else if (draft.settings.bosses.includes(boss)) {
            return console.log('Boss already added'); // null
        } else {
            draft.settings.bosses.push(boss);
            return true;
        }
    },
    create_draft: function() {
        draft.settings.created = true;
    },
    join_draft: function(bosses, nop) {
        draft.settings.created = true;
        draft.settings.no_of_players = nop;
    },
    start_draft: function() {
        if (draft.settings.no_of_players == draft.players.length) {
            // start timer
            // start get picks ping
        } else {
            console.log('Waiting for players to join draft');
        }
    },
}

document.addEventListener("DOMContentLoaded", function(event) {
    console.log('draft.js (0) loaded');
});
