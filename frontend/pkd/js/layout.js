let layout = {
    board: null,
    set_board: function(div) {
        layout.board = div;
    },
    display_options: function() {
        layout.board.innerHTML = `<div id="options">
            <div id="options_div">
                <text id="nop_div">
                    <label>Number of players: </label>
                    <select id="no_of_players">
                        <option>2</option>
                        <option>3</option>
                        <option selected>4</option>
                        <option>5</option>
                        <option>6</option>
                    </select>
                </text>
                <text id="nor_div">
                    <label> Number of rounds: </label>
                    <select id="no_of_rounds">
                        <option selected>6</option>
                        <option>8</option>
                        <option>10</option>
                        <option>12</option>
                        <option>18</option>
                    </select>
                </text>
            <button id="new_draft">Start draft</button>
            </div>
            <div id="join_draft">
                Draft id: <input type="text" id="join_draft_id">
                <button id="join_draft_button">Join draft</button>
            </div>
            <div id="add_bosses_div">
                <div id="display_boss" class="table">
                    <div class="tablebody"><div class="tablecell basic-border">Bosses: </div></div>
                </div>
                <label>Add bosses: </label><input type="text" id="add_boss_input"/>
                <button id="add_boss_button">Add</button>
            </div>
            <!-- <div id="limitations">
                exclude: types (flying, fire, grass, water...), mythicals, legendaries
                include only: types (flying, fire, grass, water...)
            </div> -->
        </div>`;
        if (document.querySelector("#no_of_players")) {
            document.querySelector("#no_of_players").onchange = controls.get_nop;
        }
        if (document.querySelector("#no_of_rounds")) {
            document.querySelector("#no_of_rounds").onchange = controls.get_nor;
        }
        if (document.querySelector("#new_draft")) {
            document.querySelector("#new_draft").onclick = controls.start_draft;
        }
        if (document.querySelector("#join_draft_button")) {
            document.querySelector("#join_draft_button").onclick = controls.join_draft;
        }
    },
    add_boss: function() {
        let new_boss = document.querySelector("#add_boss_input").value;
         if (new_boss != '') {
             if (draft.add_boss(new_boss)) {
                 let boss = layout.add_div(false, "tablecell basic-border",
                     document.querySelector("#display_boss").firstElementChild);
                 boss.innerHTML = new_boss;
             }
         }
    },
    create_draft: function(pid) {
        layout.display_picks(pid);
        layout.create_start_button();
        if (document.querySelector("#start_draft_button")) {
            // addEventListener
        }
    },
    draft_board_head: function() {
        let html = `<div id="display_boss" class="table">
            <div class="tablebody"><div class="tablecell basic-border">Bosses: </div>`;
        for(let i = 0; i < draft.settings.bosses.length; i++) {
            html += '<div class="tablecell basic-border">' + draft.settings.bosses[i] + '</div>';
        }
        html += `</div></div>
        <div>Draft Id: <text id="draft_id">`+
        draft.settings.draft_id+'</text></div>';
        return html;
    },
    display_picks: function(active_player) {
        layout.board.innerHTML = layout.draft_board_head();
        let table = layout.add_div('draft_table', 'table center-div', layout.board);
        let head = layout.add_div('draft_head', 'tableheading', table);
        let cell = layout.add_div(false, 'tablecell basic-border', head);
        cell.innerHTML = 'Players';
        for (let i = 1; i <= draft.settings.no_of_rounds; i++) {
            let cell = layout.add_div(false, 'tablecell basic-border', head);
            cell.innerHTML = 'Round ' + i;
        }
        for (let i = 0; i < draft.players.length; i++) {
            let row;
            if (i == active_player) {
                row = layout.add_div(false, 'tablebody highlight', table);
            } else {
                row = layout.add_div(false, 'tablebody', table);
            }
            let cell = layout.add_div(false, 'tablecell basic-border', row);
            cell.innerHTML = draft.players[i].display_player();
            for (let j = 0; j < draft.settings.no_of_rounds; j++) {
                let cell = layout.add_div(false, 'tablecell basic-border', row);
                cell.innerHTML = '.';
            }
        }
        let selector = layout.add_div('pick_selector', 'center-div', layout.board);
        selector.innerHTML = 'Pick: <input type="text"> *';
    },
    create_start_button: function() {
        timer.display_timer('timer');
        layout.add_element({'etype':'button', 'eid':'start_draft_button', 'text':'start draft'}, document.querySelector('#timer'));
    },
    add_element: function(obj, parent) {
        let element = document.createElement(obj.etype);
        if (obj.eclass) {
            element.setAttribute("class", obj.eclass);
        }
        if (obj.eid) {
            element.setAttribute("id", obj.eid);
        }
        if (obj.text) {
            element.textContent = obj.text;
        }
        parent.appendChild(element);
        return element;
    },
    add_div: function(name, type, parent) {
        return layout.add_element({'etype':'div','eclass':type,'eid':name}, parent);
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
}

document.addEventListener("DOMContentLoaded", function(event) {
    console.log('layout.js (2) loaded');
    layout.set_board(document.querySelector("#board"));
    layout.display_options();

    autocomplete.create_simple('add_boss_input',
		['Machamp', 'Alakazam', 'Gengar', 'Ninetales', 'Scyther', 'Omastar', 'Porygon']);
});
