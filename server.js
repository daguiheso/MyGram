var express = require('express');
var multer  = require('multer');
var ext = require('file-extension');

/*https://www.npmjs.com/package/multer#diskstorage*/
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null, +Date.now() + '.' + ext(file.originalname))
  }
})
 
var upload = multer({ storage: storage }).single('picture') /*le pasamos picture que es el atributo name que lleva el input detipo file en el form*/ 

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

app.post('/api/pictures', function (req, res) {
	upload(req, res, function (err) {
		if(err) {
			return res.send(500, "Error uploading file")
		}
		res.send('File uploaded')
	})
})

app.get('/api/user/:username', function (req, res) {
	const user = {
		username: 'Lore',
		avatar: 'https://pbs.twimg.com/profile_images/662655718181486592/w22nQBg_.jpg',
		pictures: [
			{
				id: 1,
				src: 'http://2.bp.blogspot.com/-y0aJ6bN98F0/Upi95Qpe8RI/AAAAAAAAGc4/-L8B-WtJmHY/s1600/Girl_01_Small%202.png',
				likes: 3,
				createdAt: new Date().getTime()
			},
			{
				id: 2,
				src: 'https://blog.eu.playstation.com/files/avatars/avatar_64944.jpg',
				likes: 31,
				createdAt: new Date().getTime()
			},
			{
				id: 3,
				src: 'http://topovideo.com/wp-content/uploads/2015/02/AVATAR-MARION.png',
				likes: 5,
				createdAt: new Date().getTime()
			},
			{
				id: 4,
				src: 'http://metaversemodsquad.files.wordpress.com/2009/11/avatar-1940.jpg',
				likes: 9,
				createdAt: new Date().getTime()
			},
			{
				id: 9,
				src: 'http://www.windowscentral.com/sites/wpcentral.com/files/styles/xlarge_wm_brw/public/field/image/2015/04/xbox-avatars-1.jpg?itok=HqAgDKgJ',
				likes: 13,
				createdAt: new Date().getTime()
			}
		]
	}

	res.send(user)
})

app.get('/:username', function (req, res) {
	res.render('index', { title: 'MyGram - ${req.params.username}'})
})

app.listen(3000, function (err) {
	if (err) return console.log('Hubo un error'), process.exit(1);
	console.log('Mygram escuchando por el puerto 3000');
})