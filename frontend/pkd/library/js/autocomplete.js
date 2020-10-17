var autocomplete = {
	source: ['example'],
	min_characters: 1,
    keyup: function(event) {
		let input = event.target;
		let list = document.querySelector('#'+input.getAttribute('list'));
		if (!isNaN(input.value) || input.value.length < autocomplete.min_characters ) {
			return false;
		} else {
			autocomplete.display_list(list, autocomplete.source);
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
	// get_remote_source: function(list) {
	// 	autocomplete.xhr.abort(); // clear previous request
	// 	autocomplete.xhr.onreadystatechange = function() {
	// 		if (this.readyState == 4 && this.status == 200) {
	// 			var response = JSON.parse(this.responseText);
	// 			autocomplete.display_list(list, response);
	// 		}
	// 	};
	// },
};

document.addEventListener("DOMContentLoaded", function(event) {
	document.querySelector('#name_input').addEventListener("keyup", function(event){
		autocomplete.keyup(event);
	});
});
