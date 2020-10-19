let draft = {
    settings: {
        draft_id: false,
        no_of_players: 4,
        no_of_rounds: 6,
        bosses: [],
        max_time: false,
        started: false,
    },
    players: [],
    options: [{index:0, name:null, status: false}], // index 0
    turn: 0,
    get_current_player: function() {
        return draft.players[draft.get_current_turn()];
    },
    get_current_turn: function() {
        let round = Math.floor((draft.turn)/draft.settings.no_of_players);
        if (round > draft.settings.no_of_rounds) {
            return false; // draft is over
        } // else
        if ((round%2)==1) { // odd
            return (draft.settings.no_of_players - ((draft.turn%draft.settings.no_of_players)+1));
        } else { // even
            return (draft.turn % draft.settings.no_of_players);
        }
    },
    create_option: function(i, name) {
        return {
            index: i,
            name: name,
            status: 'available',
        };
    },
    create_options: function(options) {
        for (let i = 0; i < options; i++) {
            draft.options.push(draft.create_option(i, options[i]));
        }
    },
    create_player: function(pid) {
        return {
            pid: pid,
            picks: [],
            username: false,
            select: function(pick) {
                let player = this;
                if (draft.get_current_turn()==player.pid) {
                    if (pick.status == 'available') {
                        player.options[pick.index].status = 'selected';
                        player.picks.push(pick);
                        draft.turn++;
                    } else {
                        console.log('Invalid pick');
                    }
                } else {
                    console.log('Not your turn');
                }
            },
            display_player: function() {
                if (this.username) {
                    return this.username;
                } // else
                return 'Player ' + (this.pid+1);
            },
        };
    },
    add_boss: function(boss) {
        if (draft.settings.started) {
            return console.log('Draft has already started'); // null
        } else if (draft.settings.bosses.includes(boss)) {
            return console.log('Boss already added'); // null
        } else {
            draft.settings.bosses.push(boss);
            return true;
        }
    },
    create_draft: function(bosses) {
        draft.settings.bosses = bosses;
        for (let i = 0; i < draft.settings.no_of_players; i++) {
            draft.players.push(draft.create_player(i));
        }
        return (draft.settings.started = true); // true
    },
}

document.addEventListener("DOMContentLoaded", function(event) {
    console.log('draft.js (0) loaded');
});
