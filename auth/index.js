var LocalStrategy = require('passport-local').Strategy
var FacebookStrategy = require('passport-facebook').Strategy
var mygram = require('MyGram-client')
var config = require('../config')

var client = mygram.createClient(config.client)

// estrategia local que recibe a done que es un callback que se ejecuta cuando termine el proceso
exports.localStrategy = new LocalStrategy((username, password, done) => {
  client.auth(username, password, (err, token) => {
    if (err) {
      // llamando al callback
      return done(null, false, { message: 'username and password not found' })
    }

    // obteniendo info del user
    client.getUser(username, (err, user) => {

      if (err) {
        return done(null, false, { message: `an error ocurred: ${err.message}` })
      }

      // dando token a user
      user.token = token
      return done(null, user)
    })
  })
})

/*
 * Intanciamos la clase y esta en vez de una funcion como localStrategy, me recibe como
 * primer argumento un objeto de configuración y como segundo param el callback que recibe
 * los datos que vienen del proceso de auth
 */
exports.facebookStrategy = new FacebookStrategy({
  // app Id
  clientId: config.auth.facebook.clientId,
  // app secret
  clientSecret: config.auth.facebook.clientSecret,
  // url del cb en la cual recibo los params de auth
  callbackURL: config.auth.facebook.callbackURL,
  // fields from perfil FB
  profileFields: ['id', 'displayName', 'email']
}, function (accessToken, refreshToken, profile, done) {
  var userProfile = {
    username: profile._json.id,
    name: profile._json.name,
    email: profile._json.email,
    facebook: true // propiedad para saber si es un user social o no
  }

  findOrCreate(userProfile, (err, user) => {
    // retorno de callback
    return done(null, user)
  })

  // funcion buscar user o crearlo
  function findOrCreate (user, cb) {
    client.getUser(user.username, (err, usr) => {
      if (err) {
        return client.saveUser(user, cb)
      }

      // llamando cb sin ningun error y le mando el user obtenido de la DB
      cb(null, usr)
    })
  }
})

// serializacion del user
exports.serializeUser = function (user, done) {
  // llamando callback
  done(null, {
    username: user.username,
    token: user.token
  })
}

// deserializar user
exports.deserializeUser = function (user, done) {

    // console.log('getUser usr:'+ user.token)
  client.getUser(user.username, (err, usr) => {
    // dando token a user
    usr.token = user.token
    done(err, usr)
  })
}
