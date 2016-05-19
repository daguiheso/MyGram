var page = require('page');
var title = require('title');


page('/', function (ctx, next) {
	title('MyGram');	
	var main = document.getElementById('main-container');
	main.innerHTML = '<a href="/signup">Signup</a>';
})
