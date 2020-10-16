let draft = {
    settings: {
        no_of_players: 4,
    },
    players: [],
    options: [],
    turn: 0,
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
            completed_picks: [],
            select: function(pick) {
                if (pick.status == 'available') {
                    this.options[pick.index].status = 'selected';
                    this.completed_picks.push(pick);
                } else {
                    console.log('Invalid option');
                }
            },
            display_player: function() {
                return 'Player ' + (this.pid+1);
            },
        }
    },
    create_draft: function(options) {
        for (let i = 0; i < draft.settings.no_of_players; i++) {
            draft.players.push(draft.create_player(i));
        }
        for (let i = 0; i < options; i++) {
            draft.options.push(draft.create_option(index, name));
        }
    }
}

document.addEventListener("DOMContentLoaded", function(event) {
    console.log('draft.js (0) loaded');
});
