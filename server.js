var express = require('express');

var app = express();

/*configurando motor de jade/pug para vistas*/
app.set('view engine', 'pug');

/*Le decimos que public va a estar accesible*/
app.use(express.static('public'))  /*app.use define un midleware, e indica a nuestro server que se sirva public de manera statica*/
/* rutas */
app.get('/', function (req,res) {
	res.render('index')
})
app.get('/signup', function (req,res) {
	res.render('index')
})
app.get('/signin', function (req,res) {
	res.render('index')
})

app.listen(3000, function (err) {
	if (err) return console.log('Hubo un error'), process.exit(1);
	console.log('Mygram escuchando por el puerto 3000');
})