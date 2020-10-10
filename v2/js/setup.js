let setup = {
    settings: {
        min_players: 2,
        max_players: 4,
        options: ['remote', 'local'],
    },
    create_nop_selector: function(min, max) {
        let html = `<label id="number_of_players_label">Number of players: </label>
            <text id="player_turn"><select id="no_of_players">
                <option>2</option>
                <option>3</option>
                <option>4</option>
            </select></text>`;
        return html;
    }
};

document.addEventListener("DOMContentLoaded", function(event) {
    console.debug('setup.js loaded');
    document.querySelector("#turn").innerHTML = setup.create_nop_selector(2, 4) + `
    <text id="game_id"><button id="start_game">Start New Game</button>
        <b>OR</b> Game id: <input type="text" id="join_game_id"/>
        <button id="join_game">Join Game</button></text>`;
    document.querySelector("#instructions").innerHTML = `<div id="instruction_text">King on the Hill is a simple game, where you try to get your king on top of a hill. Each player begins with one king and two pawns. On your turn, you must move one piece and build with the moved piece.
    <br/><br/>There are four levels: base, middle, top, cap. You want your king placed on top of the third level (top).
    <br/>You may move your piece to any adjacent square (including diagonals). You may build on any adjacent square (including diagonals).
    <br/>When moving, you cannot move to a space where another piece resides. You cannot move onto a cap. You cannot move up more than one level at a time. You may move down multiple levels.
    <br/>When you build, you cannot build on a square where another piece resides. You cannot build on top of a cap. There is no limitation on the level you can build at: you can be on the ground and build a cap.
    <br/><br/>The king has a special ability: when moving, it can swap places with an adjacent pawn that it controls (same team).</div><button id="toggle_instructions">hide instructions</button>`;
});
