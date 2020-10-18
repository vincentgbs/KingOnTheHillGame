var autocomplete = {
	source: {},
	min_characters: 1,
	create: function(input_id, type, source) {
		let input = document.querySelector('#'+input_id);
		input.setAttribute('type', type);
		if (type == 'static') {
			autocomplete.source[input_id] = source;
		} else {
			input.setAttribute('source', source);
		}
		input.addEventListener("keyup", function(event){
			autocomplete.keyup(event);
		});
	},
    keyup: function(event) {
		let input = event.target;
		let list = document.querySelector('#'+input.getAttribute('list'));
		if (!isNaN(input.value) || input.value.length < autocomplete.min_characters ) {
			return false;
		} else {
			if (input.getAttribute('type') == 'static') {
				autocomplete.display_list(list, autocomplete.source[input.getAttribute('id')]);
			} else {
				//autocomplete.get_remote_source();
			}
		}
	},
	display_list: function(list, source) {
		list.innerHTML = '';
		source.forEach(function(item) {
			var option = document.createElement('option');
			option.value = item;
			list.appendChild(option);
		});
	},
	xhr: new XMLHttpRequest(),
	get_remote_source: function(list) {
		autocomplete.xhr.abort(); // clear previous request
		autocomplete.xhr.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				var response = JSON.parse(this.responseText);
				autocomplete.display_list(list, response);
			}
		};
	},
};

document.addEventListener("DOMContentLoaded", function(event) {
	setTimeout(function() {
		autocomplete.create('add_boss_input', 'static', ['example', 'test']);
	}, 999);
});
