var LocalStrategy = require('passport-local').Strategy
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

// serializacion del user
exports.serializationUser = function (user, done) {
  // lamando callback
  done(null, {
    username: user.username,
    token: user.token
  })
}

// deserializar user
exports.deserilizeUser = function (user, done) {
  client.getUser(user.username, (err, usr) => {
    // dando token a user
    usr.token = user.token
    done(err, usr)
  })
}
