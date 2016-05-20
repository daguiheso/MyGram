var page = require('page');
var empty = require('empty-element');
var template = require('./template');
var title = require('title');
var request = require('superagent');
var headermidderware = require('../header')

page('/', headermidderware, loadPictures, function (ctx, next) {
	title('MyGram');
	var main = document.getElementById('main-container');
	empty(main).appendChild(template(ctx.pictures));
})

function loadPictures(ctx, next) {
	request
		.get('/api/pictures')
		.end(function (err, res) {
			if (err) return console.log(err);		
			
			ctx.pictures = res.body  /*context  va cargando datos y los comparte a traves de los middleware*/
			next();
		})
}