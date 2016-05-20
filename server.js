var express = require('express');

var app = express();

/*configurando motor de jade/pug para vistas*/
app.set('view engine', 'pug');

/*Le decimos que public va a estar accesible*/
app.use(express.static('public'))  /*app.use define un midleware, e indica a nuestro server que se sirva public de manera statica*/
/* rutas */
app.get('/', function (req,res) {
	res.render('index', { title: 'MyGram'})
})
app.get('/signup', function (req,res) {
	res.render('index', { title: 'MyGram - Signup'})
})
app.get('/signin', function (req,res) {
	res.render('index', { title: 'MyGram - Signin'})
})

app.get('/api/pictures', function (req, res) {
	var pictures = [
		{
			user: {
				username: 'Daniel H',
				avatar: 'https://scontent-mia1-1.xx.fbcdn.net/v/t1.0-9/12963889_10208901904603330_6870354961841214887_n.jpg?oh=f819a022e52be19cabaabd89d6cb39ce&oe=57E6B7F5'
			},
			url: 'http://materializecss.com/images/office.jpg',
			likes: 0,
			liked: false,
			createdAt: new Date().getTime()
		},
		{
			user: {
				username: 'David Pte',
				avatar: 'https://scontent-mia1-1.xx.fbcdn.net/v/t1.0-9/13240476_10207468828932980_766208754586076978_n.jpg?oh=ae997f0f10403f65499674f5a2869757&oe=579DE806'
			},
			url: 'http://materializecss.com/images/office.jpg',
			likes: 1,
			liked: true,
			createdAt: new Date().setDate(new Date().getDate() - 10)
		}
	];

	setTimeout(function () {
		res.send(pictures);
	}, 2000);
})

app.listen(3000, function (err) {
	if (err) return console.log('Hubo un error'), process.exit(1);
	console.log('Mygram escuchando por el puerto 3000');
})