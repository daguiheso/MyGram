var page = require('page');
var empty = require('empty-element');
var template = require('./template');
var title = require('title');
var request = require('superagent');
var headermidderware = require('../header');
var axios = require('axios');

page('/', headermidderware, asyncLoad, function (ctx, next) {
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

async function asyncLoad (ctx, next) {
	try {
		/*await detiene la ejecucion del proceso hasta que se cumpla la promesa y en caso de  error lo manda al catch*/
		ctx.pictures = await fetch('/api/pictures').then(res => res.json());   /*return implicitamente por ser una linea de codigo*/
		next();
	} catch (err) {
		return console.log(err);
	}
}