let draft = {
    settings: {
        draft_id: false,
        no_of_players: 4,
        bosses: [],
        max_time: false,
        started: false,
    },
    players: [],
    options: [],
    turn: 0,
    get_current_player: function() {
        return draft.players[draft.get_current_turn()];
    },
    get_current_turn: function() {
        return (draft.turn % draft.settings.no_of_players);
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
            console.log('Draft has already started');
        } else {
            draft.settings.bosses.push(boss);
        }
    },
    start_draft: function() {
        if (draft.settings.bosses.length > 0) {
            for (let i = 0; i < draft.settings.no_of_players; i++) {
                draft.players.push(draft.create_player(i));
            }
            return (draft.settings.started = true);
        } else {
            console.log('You should add bosses before starting to draft');
            return false;
        }
    },
}

document.addEventListener("DOMContentLoaded", function(event) {
    console.log('draft.js (0) loaded');
});
