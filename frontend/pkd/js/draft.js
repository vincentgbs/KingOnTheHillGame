let draft = {
    settings: {
        no_of_players: 4,
        bosses: [],
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
    create_player: function(pid) {
        return {
            pid: pid,
            picks: [],
            username: '',
            select: function(pick) {
                if (draft.get_current_turn()==this.pid) {
                    let player = this;
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
            display_player_no: function() {
                return 'Player ' + (this.pid+1);
            },
        };
    },
    add_boss: function(boss) {
        if (started) {
            console.log('Draft has already started');
        } else {
            draft.settings.bosses.push(boss);
        }
    },
    start_draft: function(options) {
        if (draft.settings.bosses.length > 0) {
            for (let i = 0; i < draft.settings.no_of_players; i++) {
                draft.players.push(draft.create_player(i));
            }
            for (let i = 0; i < options; i++) {
                create_option(i, options[i]);
            }
        } else {
            console.log('You should add bosses before starting to draft');
        }
    },
}

document.addEventListener("DOMContentLoaded", function(event) {
    console.log('draft.js (0) loaded');
});
