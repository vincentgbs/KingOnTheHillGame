let layout = {
    board: null,
    set_board: function(div) {
        draft.board = div;
    },
    display_table: function(players) {
        let table = draft.add_div('draft_table', 'table center-div', draft.board);
        let head = draft.add_div('draft_head', 'tableheading', table);
        for (let i = 0; i < players; i++) {
            let cell = draft.add_div(false, 'tablecell basic-border', head);
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
        return draft.add_element({'etype':'div','eclass':type,'eid':name}, parent);
    },
}

document.addEventListener("DOMContentLoaded", function(event) {
    console.log('layout.js (1) loaded');
    layout.set_board(document.querySelector("#board"));
});
