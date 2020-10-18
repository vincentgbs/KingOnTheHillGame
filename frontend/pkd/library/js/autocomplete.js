var autocomplete = {
	source: {},
	min_characters: 1,
	create_simple: function(input_id, source) {
		let input = document.querySelector('#'+input_id);
		autocomplete.source[input_id] = source;
		input.setAttribute('list', input_id+'_list');
		input_list = document.createElement('datalist');
		input_list.setAttribute('id', input_id+'_list');
		input.after(input_list);
		input.addEventListener("keyup", function(event){
			autocomplete.simple_keyup(event);
		});
	},
	simple_keyup: function(event) {
		let input = event.target;
		let list = document.querySelector('#'+input.getAttribute('list'));
		if (!isNaN(input.value) || input.value.length < autocomplete.min_characters ) {
			return false;
		} else {
			autocomplete.simple_display(list, autocomplete.source[input.getAttribute('id')]);
		}
	},
	simple_display: function(list, source) {
		list.innerHTML = '';
		source.forEach(function(item) {
			var option = document.createElement('option');
			option.value = item;
			list.appendChild(option);
		});
	},
	create_remote: function(input_id, source) {
		let input = document.querySelector('#'+input_id);
		autocomplete.source[input_id] = source;
		input.addEventListener("keyup", function(event){
			autocomplete.simple_keyup(event);
		});
	},
	remote_keyup: function(event) {
		let input = event.target;
		let list = document.querySelector('#'+input.getAttribute('list'));
		if (!isNaN(input.value) || input.value.length < autocomplete.min_characters ) {
			return false;
		} else {
			autocomplete.remote_display(list, autocomplete.source[input.getAttribute('id')]);
		}
	},
	remote_display: function(list, source) {
		// autocomplete.xhr.abort(); // clear previous request
		// autocomplete.xhr.open('POST', source);
		// autocomplete.xhr.onreadystatechange = function() {
		// 	if (this.readyState == 4 && this.status == 200) {
		// 		var response = JSON.parse(this.responseText);
		// 		autocomplete.simple_display(list, response);
		// 	}
		// };
		// autocomplete.xhr.send(request);
	},
	xhr: new XMLHttpRequest(),
};
