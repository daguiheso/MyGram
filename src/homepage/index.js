var page = require('page');
var empty = require('empty-element');
var template = require('./template');
var title = require('title');
var request = require('superagent');
var headermidderware = require('../header');
var axios = require('axios');
var Webcam = require('webcamjs');
var pictureCard = require('../picture-card');

page('/', headermidderware, loading, asyncLoad, function (ctx, next) {
	title('MyGram');
	var main = document.getElementById('main-container');
	empty(main).appendChild(template(ctx.pictures));

	const picturePreview = $('#picture-preview');
	const camaraInput = $('#camera-input');
	const cancelPicture = $('#cancelPicture');
	const shootButton = $('#shoot');
	const uploadButton = $('#uploadButton');

	/* function reset form after shoot photo*/
	function reset() {
		picturePreview.addClass('hide');
		uploadButton.addClass('hide');
		cancelPicture.addClass('hide');
		shootButton.removeClass('hide');
		camaraInput.removeClass('hide');
	}

	cancelPicture.click(reset);

	/* open modal camera - leanModal => materialize method*/
	$('.modal-trigger').leanModal({
		/* Ejecuta cuando se dispara modal*/
		ready: function () {
			Webcam.attach('#camera-input'); /* config webcamjs*/
			/* Al tomar foto se añade y quita clase css*/
			shootButton.click((ev) => {
				Webcam.snap((data_uri) => {
					picturePreview.html(`<img src="${data_uri}"/>`);
					picturePreview.removeClass('hide');
					uploadButton.removeClass('hide');
					cancelPicture.removeClass('hide');
					shootButton.addClass('hide');
					camaraInput.addClass('hide');
					uploadButton.off('click'); /* $(elements).off(), se eliminan todos los eventos asociados al conjunto seleccionado*/
					uploadButton.click(() => {
						const pic = {
							url: data_uri,
							likes: 0,
							liked: false,
							createdAt: +new Date(), /* ponemos + para que tome el tampstam*/
							user: {
								username: 'Daniel H num 2',
								avatar: 'https://scontent-mia1-1.xx.fbcdn.net/v/t1.0-9/12963889_10208901904603330_6870354961841214887_n.jpg?oh=f819a022e52be19cabaabd89d6cb39ce&oe=57E6B7F5'
							}
						}
						/* prepend pone el elemento antes de los otros*/
						$('#picture-cards').prepend(pictureCard(pic));
						reset();
						$('#modalCamara').closeModal();
					})
				} );
			})
		},
		/* Ejecuta cuando se cierra modal*/
		complete: function () {
			Webcam.reset();
			reset();
		}
	})
})

/*spiner loading - create div*/
function loading(ctx, next) {
	var el = document.createElement('div');
	el.classList.add('loader');
	document.getElementById('main-container').appendChild(el);
	next();
}

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