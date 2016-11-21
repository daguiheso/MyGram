var axios = require('axios')

// utilizamos axios porque fetch no soporta cookies es un caveat de fetch.

async function loadAuth (ctx, next) {
  try {
    // obteniendo respuesta de un http request
    var whoami = await axios.get('/whoami').then(res => res.data)
    if (whoami.username) {
      ctx.auth = whoami
    } else {
      ctx.auth = false
    }
    next()
  } catch (err) {
    console,log(err)
  }
}

exports.loadAuth = loadAuth
