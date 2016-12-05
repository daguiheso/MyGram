var express = require('express');
var multer  = require('multer');
var ext = require('file-extension');
var aws = require('aws-sdk')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var expressSession = require('express-session')
var passport = require('passport')
var mygram = require('MyGram-client')
var auth = require('./auth')
var multerS3 = require('multer-s3')
var config = require('./config')
var port = process.env.PORT || 5050

// instancia de cliente
var client = mygram.createClient(config.client)

var s3 = new aws.S3({
	accessKeyId: config.aws.accessKey,
	secretAccessKey: config.aws.secretKey
})

/* https://www.npmjs.com/package/multer-s3 */
var storage = multerS3({
	s3: s3,
	bucket: 'mygram',
	acl: 'public-read', // access control list (visibilidad de los archivos)
	metadata : function (req, file, cb) {
		cb(null, { fieldName: file.fieldname })
	},
	key: function (req, file, cb) {
		cb(null, +Date.now() + '.' + ext(file.originalname))
	}

})

// middleware de upload
var upload = multer({ storage: storage }).single('picture') /*le pasamos picture que es el atributo name que lleva el input detipo file en el form*/

var app = express();

/*
 * queremos que express sea capaz de hacer parse de peticions http que contengan un json,
 * de esta manera cualquier peticion que llegue con un json vamos a poder obtener el obj
 * json en el body de nuestro request de una manera ya serializada
 */
app.set(bodyParser.json())

/*
 * middleware para poder recibir los params del request que vienen desde un form que los
 * codifica la peticion http de manera diferente y le pasamos una property que necesita
 * por defecto y es que el obj que viene no va a ser extendido
 */
app.use(bodyParser.urlencoded({ extended: false }))

/* middleware para que express sea capaz de repsonder por el cookieParser */
app.use(cookieParser())
/*
 * expressSession tiene parametros de configuracion:
 *
 * secret: clave secreta con la que express va a codificsr parametros de session
 * resave: para que no vuelva y guarde la sesion y solo lo haga una vez se ponde en false
 * saveUnitialized: para que no almacene sesiones que no han sido inicializadas en flase se pone
 */
app.use(expressSession({
	secret: config.secret,
	resave: false,
	saveUninitialized: false
}))

// Inicializando passport
app.use(passport.initialize())
// para persistencia de session
app.use(passport.session())

/*configurando motor de jade/pug para vistas*/
app.set('view engine', 'pug');

/*Le decimos que public va a estar accesible*/
app.use(express.static('public'))  /*app.use define un midleware, e indica a nuestro server que se sirva public de manera statica*/

/* utilizando strategia local-strategy */
passport.use(auth.localStrategy)
passport.use(auth.facebookStrategy)
/* le decimos a paspport que metodo utilice para deserializar*/
passport.deserializeUser(auth.deserializeUser)
/* le decimos a passport metodo para serializar users */
passport.serializeUser(auth.serializeUser)

/* rutas */
app.get('/', function (req,res) {
	res.render('index', { title: 'MyGram'})
})

app.get('/signup', function (req,res) {
	res.render('index', { title: 'MyGram - Signup'})
})

app.post('/signup', function (req,res) {
	// obteniendo usuario del body gracias a body-parser
	var user = req.body
	client.saveUser(user, function (err, usr) {
		if (err) return res.status(500).send(err.message)

		res.redirect('signin')
		// res.status(200)
	})
})

app.get('/signin', function (req,res) {
	res.render('index', { title: 'MyGram - Signin'})
})

/*
 * defino ruta de login y le defino el middleware de auth, passport js tiene un metodo llamado
 * authenticate en el cual yo le defino con que estrategia voy a autenticar y los parametros de
 * configuracion de esa estrategia.
 */
app.post('/login', passport.authenticate('local', {
	// cuando login sea exitoso ir a la ruta principal
	successRedirect: '/',
	// si hubo un error mandar de nuevo a login
	failureRedirect: '/signin'
}))

app.get('/logout', function (req, res) {
	// passport js me entrega un metodo logout() dentro del request
	req.logout()

	res.redirect('/')
})

/*
 * implementacion de strategia de fb y como 2 param los permisos de nuestra app con FB,
 * pues passport js permite que le pasemos estos permisos a FB asi que le pedimos en este
 * caso el permiso de obtener el email del usuario, estos permisos se los pasamos con una
 * propiedad llamada scope, puede ser un array o un string para un solo permiso. De esta
 * manera ya le digo a FB que me autentique y me lanza una modal de navegador de FB.
 *
 * Pero necesitamos crear otra ruta que es la que recibe los tokens que llegan de FB
 */
app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email']}))

/*
 * ruta donde recibo la informacion de FB, utilizamos nuevamente la estrategia de FB y
 * muy parecido a la strategia local le pasamos parametros
 */
app.get('/auth/facebook/callback', passport.authenticate('facebook', {
	// cuando login sea exitoso ir a la ruta principal
	successRedirect: '/',
	// si hubo un error mandar de nuevo a login
	failureRedirect: '/signin'
}))

/* funcion que es un middleware que me va a permitir garantizar que el usuario fue autenticado
 * De esta manera si yo intento entrar a una ruta que esta protegida por este middleware el me
 * va a decir que no estoy autenticado
 */
function ensureAuth (req, res, next) {
	/*
	 * metodo de passport que se injecta al objeto de request y se llama isAuthenticate() y si el
	 * usuario fue autenticado correctamente usando una de las estrategias definidas este objeto
	 * isAuthenticate retorna true, si no false
	 */
	if (req.isAuthenticated()) {
		return next()
	}

	res.status(401).send( { error: 'not authenticated' })
}

app.get('/whoami',function (req, res) {
	if (req.isAuthenticated()) {
		// devolviendo el usuario que esta en el objeto de request, en el request queda la info del usuario autenticado
		return res.json(req.user)
	}
	// respondemos con objeto de usuario no autenticado
	res.json({ auth: false})
})

app.get('/api/pictures', function (req, res) {

	client.listPictures(function (err, pictures) {
		if (err) return res.send([])
		console.log(pictures)
		res.send(pictures)
	})
	// var pictures = [
	// 	{
	// 		user: {
	// 			username: 'Daniel H',
	// 			avatar: 'https://scontent-mia1-1.xx.fbcdn.net/v/t1.0-9/12963889_10208901904603330_6870354961841214887_n.jpg?oh=f819a022e52be19cabaabd89d6cb39ce&oe=57E6B7F5'
	// 		},
	// 		url: 'http://materializecss.com/images/office.jpg',
	// 		likes: 0,
	// 		liked: false,
	// 		createdAt: new Date().getTime()
	// 	}
	// ];

	// setTimeout(() => res.send(pictures), 2000);
})

/*
 * El middlewrae que queremos asegurar es el de guardar imagen "POST /picture", entonces toda ruta en express recibe como primer
 * argumento el nombre de la ruta y puede recibir como segundo argumento un middleware para que solo se ejecute para esa ruta
 */
app.post('/api/pictures', ensureAuth, function (req, res) {
	upload(req, res, function (err) {
		if(err) {
			return res.send(500, `Error uploading file: ${err.message}`)
		}
		
		var user = req.user;
		var token = req.user.token;
		var username = req.user.username;
		var src = req.file.location;

		client.savePicture({
			src: src,
			userId: username,
			user: {
				username: username,
				avatar: user.avatar,
				name: user.name
			}
		},
		token, function (err, img) {
			if (err) {
				return res.status(500).send(err.message)
			}

			res.send(`File uploaded: ${req.file.location}`)
		})
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

app.get('/:username/:id', function (req, res) {
	res.render('index', { title: 'MyGram - ${req.params.username}'})
})

app.listen(port, function (err) {
	if (err) return console.log('Hubo un error'), process.exit(1);
	console.log('Mygram escuchando por el puerto ' + port);
})