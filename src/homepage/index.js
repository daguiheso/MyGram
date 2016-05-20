var page = require('page');
var empty = require('empty-element');
var template = require('./template');
var title = require('title');
var request = require('superagent');
var headermidderware = require('../header');
var axios = require('axios');

page('/', headermidderware, loadPicturesFetch, function (ctx, next) {
	title('MyGram');
	var main = document.getElementById('main-container');
	empty(main).appendChild(template(ctx.pictures));
})

/*superagent*/
function loadPictures(ctx, next) {
	request
		.get('/api/pictures')
		.end(function (err, res) {
			if (err) return console.log(err);		
			
			ctx.pictures = res.body  /*context  va cargando datos y los comparte a traves de los middleware*/
			next();
		})
}

/*axios*/
function loadPicturesAxios(ctx, next) {
	axios
		.get('/api/pictures')
		.then(function (res) {
	    	ctx.pictures = res.data  /*context  va cargando datos y los comparte a traves de los middleware*/
	    	next();
	    })
	  	.catch(function (err) {
	    	console.log(err);
	  	});	
}

/*fetch nativo en navegadores*/
function loadPicturesFetch(ctx, next) {
	fetch('/api/pictures')
	.then(function (res) {
		return res.json();  /*este res.json obtiene los datos, mas no el res que llega*/ 
	})
	.then(function (pictures) {
		ctx.pictures = pictures  /*context  va cargando datos y los comparte a traves de los middleware*/
		next();
	})
	.catch(function(err) {
    	console.log(err);
	})
}