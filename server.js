var express = require('express');

var app = express();

/*configurando motor de jade/pug para vistas*/
app.set('view engine', 'pug');

app.get('/', function (req,res) {
	res.render('index')
})

app.listen(3000, function (err) {
	if (err) return console.log('Hubo un error'), process.exit(1);
	console.log('Mygram escuchando por el puerto 3000');
})