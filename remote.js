var remote = {
    xhr: new XMLHttpRequest(),
    start_new_game: function() {
        let new_game = {};
        let game_id = 'game_id_goes_here';
        remote.xhr.open('POST', 'https://192.168.33.10/KingOnTheHill/API');
        remote.xhr.onload = function () {
            let response = remote.xhr.response;
            console.debug(response);
            response = JSON.parse(response);
            console.debug(response);
            game_id = response.game_id;
        };
        remote.xhr.send(JSON.stringify(new_game));
        return game_id;
    },
    join_game: function(game_id) {
        game.create_board();
        game.set_board(2);
    },
    send_turn: function(json) {
        //
    },
    get_turn: function(game_id) {
        let ping = 0;
        while(ping < 25) {
            ping++;
        }
    },
}
