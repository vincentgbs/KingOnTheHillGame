let layout = {
    settings: {
        min_players: 2,
        max_players: 4,
        screen_ratio: (2/3),
        square_size: 0,
    },
    canvas: null,
    context: null,
    set: function(canvas, height, width){
        layout.canvas = canvas;
        layout.context = canvas.getContext("2d");
        layout.settings.square_size = Math.min(
            ((height/game.settings.vertical) * layout.settings.screen_ratio),
            ((width/game.settings.horizontal) * layout.settings.screen_ratio)
        );
        layout.resize(game.settings.vertical * layout.settings.square_size,
            game.settings.horizontal * layout.settings.square_size);
    },
    resize: function (height, width) {
        layout.canvas.height = height;
        layout.canvas.width = width;
    },

    setup: {
        create_nop_selector: function() {
            let html = `<label>Number of players: </label>
                <select id="no_of_players">`;
            for (let i = layout.settings.min_players; i <= layout.settings.max_players; i++) {
                html += `<option>`+i+`</option>`;
            }
            html += `</select>`;
            return html;
        },
        create_remote_selector: function() {
            return `<select id="remote">
                <option>remote</option>
                <option>local</option>
            </select>`;
        },
        create_start_game_button: function() {
            return `<button id="start_game_button">Start New Game</button>`;
        },
        create_join_option: function() {
            return `<label>Game id: </label>
                <input type="text" id="join_game_id"/>
                <button id="join_game_button">Join Game</button>`;
        },
        instruction_text: function() {
            return `<div id="instruction_text">King on the Hill is a simple game, where you try to get your king on top of a hill. Each player begins with one king and two pawns. On your turn, you must move one piece and build with the moved piece.
            <br/><br/>There are four levels: base, middle, top, cap. You want your king placed on top of the third level (top).
            <br/>You may move your piece to any adjacent square (including diagonals). You may build on any adjacent square (including diagonals).
            <br/>When moving, you cannot move to a space where another piece resides. You cannot move onto a cap. You cannot move up more than one level at a time. You may move down multiple levels.
            <br/>When you build, you cannot build on a square where another piece resides. You cannot build on top of a cap. There is no limitation on the level you can build at: you can be on the ground and build a cap.
            <br/><br/>The king has a special ability: when moving, it can swap places with an adjacent pawn that it controls (same team).</div>`;
        },
    },
};

document.addEventListener("DOMContentLoaded", function(event) {
    console.debug('layout.js loaded');
    const canvas = document.querySelector("#board");
    layout.set(canvas, window.screen.height, window.screen.width);

    document.querySelector("#turn").innerHTML =
        layout.setup.create_nop_selector() +
        layout.setup.create_remote_selector() +
        layout.setup.create_start_game_button() +
        ` <b>OR</b> ` +
        layout.setup.create_join_option();
    document.querySelector("#instructions").innerHTML = layout.setup.instruction_text();
});
