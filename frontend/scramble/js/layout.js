var layout = {
    settings: {
        screen_ratio: (2/3),
        square_size: null,
        framerate: 250,
        egg_color: 'Khaki',
        flash_egg_color: 'Beige',
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
        layout.draw_lines();
    },
    resize: function (height, width) {
        layout.canvas.height = height;
        layout.canvas.width = width;
    },
    draw_lines: function() {
        layout.resize(game.settings.vertical * layout.settings.square_size,
            game.settings.horizontal * layout.settings.square_size);
        for(let i = 1; i <= game.settings.horizontal; i++) {
            layout.context.beginPath();
            layout.context.moveTo(i * layout.settings.square_size, 0);
            layout.context.lineTo(i * layout.settings.square_size,
                game.settings.vertical * layout.settings.square_size);
            layout.context.stroke();
        }
        for(let i = 1; i <= game.settings.vertical; i++) {
            layout.context.beginPath();
            layout.context.moveTo(0, i * layout.settings.square_size);
            layout.context.lineTo(game.settings.horizontal * layout.settings.square_size,
                i * layout.settings.square_size);
            layout.context.stroke();
        }
    },
    draw_block: function(location) {
        layout.context.fillStyle = 'black';
        layout.context.beginPath();
        layout.context.rect(
            location.col*layout.settings.square_size,
            location.row*layout.settings.square_size,
            (layout.settings.square_size),
            (layout.settings.square_size)
        );
        layout.context.fill();
    },
    draw_blocks: function() {
        for (let i = 0; i < game.settings.vertical; i++ ) {
            for (let j = 0; j < game.settings.horizontal; j++ ) {
                if (i%2==0 && j%2==0) {
                    layout.draw_block(game.create_location(i, j));
                }
            }
        }
    },
    draw_player: function(player) {
        let location = player.location;
        let color;
        if (player.surviving) {
            color = game.settings.piece_colors[player.pid];
        } else {
            color = 'LightGrey';
        }
        let x = (location.row * layout.settings.square_size) + (layout.settings.square_size/2);
        let y = (location.col * layout.settings.square_size) + (layout.settings.square_size/2);
        layout.context.beginPath();
        layout.context.arc(x, y, (layout.settings.square_size/3), 0, Math.PI*2);
        layout.context.fillStyle = color;
        layout.context.fill();
        layout.context.closePath();
    },
    draw_players: function() {
        for(let i = 0; i < game.players.length; i++) {
            layout.draw_player(game.players[i]);
        }
    },
    draw_egg: function(egg) {
        if (egg.show) {
            let location = egg.location;
            let x = (location.row * layout.settings.square_size) + (layout.settings.square_size/2);
            let y = (location.col * layout.settings.square_size) + (layout.settings.square_size/2);
            layout.context.beginPath();
            layout.context.arc(x, y, (layout.settings.square_size/3), 0, Math.PI*2);
            if (Math.floor(performance.now())%2==0) {
                layout.context.fillStyle = layout.settings.egg_color;
            } else {
                layout.context.fillStyle = layout.settings.flash_egg_color;
            }
            layout.context.fill();
            layout.context.closePath();
        }
    },
    draw_eggs: function() {
        for(let i = 0; i < game.players.length; i++) {
            let player = game.players[i];
            for(let j = 0; j < player.eggs.length; j++) {
                layout.draw_egg(player.eggs[j]);
            }
        }
    },
    draw_eggsplosion: function(splash) {
        if (splash.show) {
            let location = splash.location;
            let x1 = ((location.row-(game.settings.splash_zone-1)) * layout.settings.square_size) + (layout.settings.square_size/2);
            let x2 = ((location.row) * layout.settings.square_size) + (layout.settings.square_size/2);
            let x3 = ((location.row+(game.settings.splash_zone-1)) * layout.settings.square_size) + (layout.settings.square_size/2);
            let y1 = ((location.col-(game.settings.splash_zone-1)) * layout.settings.square_size) + (layout.settings.square_size/2);
            let y2 = ((location.col) * layout.settings.square_size) + (layout.settings.square_size/2);
            let y3 = ((location.col+(game.settings.splash_zone-1)) * layout.settings.square_size) + (layout.settings.square_size/2);
            layout.context.beginPath(); // vertical line
            layout.context.moveTo(x2, y1);
            layout.context.lineTo(x2, y3);
            layout.context.lineWidth = 5;
            layout.context.stroke();
            layout.context.beginPath(); // horizontal line
            layout.context.moveTo(x1, y2);
            layout.context.lineTo(x3, y2);
            layout.context.lineWidth = 5;
            layout.context.stroke();
        }
    },
    draw_eggsplosions: function() {
        for(let i = 0; i < game.players.length; i++) {
            let player = game.players[i];
            for(let j = 0; j < player.splashes.length; j++) {
                layout.draw_eggsplosion(player.splashes[j]);
            }
        }
    },
    render: function() {
        layout.draw_lines(); // static
        layout.draw_blocks(); // static
        layout.draw_players();
        layout.draw_eggs();
        layout.draw_eggsplosions();
    },
    game_options: function() {
        let html = '<button id="start_game">Start Game</button>';
        if (game.settings.game_id) {
            html += ' <label>Game Id: </label><text id="game_id">'+game.settings.game_id+'</text>';
        }
        html += ' <button id="reset_options">Reset Options</button>';
        document.querySelector("#turn").innerHTML = html;
        if (document.querySelector("#reset_options")) {
            document.querySelector("#reset_options").onclick = layout.reset_options;
        }
        if (document.querySelector("#start_game")) {
            document.querySelector("#start_game").onclick = controls.start_game;
        }
    },
    reset_options: function() {
        document.querySelector("#turn").innerHTML = `
        <text id="nop_div">
            <label>Number of players: </label>
            <select id="no_of_players">
                <option selected>2</option>
                <option>3</option>
                <option>4</option>
            </select>
        </text>
        <button id="new_game">New Game</button>
        <b>OR</b>
        <div id="gid_div">
            <label>Game id: </label>
            <input type="text" id="join_game_id"/>
            <button id="join_game">Join Game</button>
        </div>`;
        if (document.querySelector("#join_game_id")) {
            document.querySelector("#join_game_id").onkeyup = remote.get_gid;
        }
        if (document.querySelector("#no_of_players")) {
            document.querySelector("#no_of_players").onchange = controls.get_nop;
        }
        if (document.querySelector("#new_game")) {
            document.querySelector("#new_game").onclick = controls.new_game;
        }
        if (document.querySelector("#join_game")) {
            document.querySelector("#join_game").onclick = controls.join_game;
        }
    },
    flashMessage: function(message, time) {
        let div = document.querySelector("#flash_message");
        div.innerText = message;
        div.style.display = 'block';
        setTimeout(function() {
            div.innerText = '';
            div.style.display = 'none';
        }, time);
    },
};

document.addEventListener("DOMContentLoaded", function(event) {
    console.log('layout.js (1) loaded');
    const canvas = document.querySelector("#board");
    layout.set(canvas, window.screen.height, window.screen.width);
    setInterval(layout.render, layout.framerate);
    layout.reset_options();
});
