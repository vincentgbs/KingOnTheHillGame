let layout = {
    board: null,
    set_board: function(div) {
        layout.board = div;
    },
    display_options: function() {
        layout.board.innerHTML = `<div id="options">
            <div id="nop_div">
                <label>Number of players: </label>
                <select id="no_of_players">
                    <option>2</option>
                    <option>3</option>
                    <option selected>4</option>
                    <option>5</option>
                    <option>6</option>
                </select>
                <button id="start_draft_button">Start draft</button>
            </div>
            <div id="add_bosses_div">
                <div id="display_boss" class="table">
                    <div class="tablebody"><div class="tablecell basic-border">Bosses: </div></div>
                </div>
                <label>Add bosses: </label><input type="text" id="add_boss_input"/>
                <button id="add_boss_button">Add</button>
            </div>
        </div>`;
    },
    add_boss: function() {
        let boss = layout.add_div(false, "tablecell basic-border",
            document.querySelector("#display_boss").firstElementChild);
         let new_boss = document.querySelector("#add_boss_input").value;
         if (new_boss != '') {
             boss.innerHTML = new_boss;
         }
    },
    display_table: function() {
        let table = layout.add_div('draft_table', 'table center-div', layout.board);
        let head = layout.add_div('draft_head', 'tableheading', table);
        for (let i = 0; i < draft.settings.no_of_players; i++) {
            let cell = layout.add_div(false, 'tablecell basic-border', head);
            cell.innerHTML = "Player " + (i+1);
        }
    },
    add_element: function(obj, parent) {
        let element = document.createElement(obj.etype);
        if (obj.eclass) {
            element.setAttribute("class", obj.eclass);
        }
        if (obj.eid) {
            element.setAttribute("id", obj.eid);
        }
        parent.appendChild(element);
        return element;
    },
    add_div: function(name, type, parent) {
        return layout.add_element({'etype':'div','eclass':type,'eid':name}, parent);
    },
}

document.addEventListener("DOMContentLoaded", function(event) {
    console.log('layout.js (1) loaded');
    layout.set_board(document.querySelector("#board"));
    layout.display_options();

    autocomplete.create_simple('add_boss_input',
		['Machamp', 'Alakazam', 'Gengar', 'Ninetales', 'Scyther', 'Omastar', 'Porygon']);
});
