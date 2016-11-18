'use strict'

const config = {
	aws: {
		accessKey: process.env.AWS_ACCESS_KEY,
		secretKey: process.env.AWS_SECRET_KEY
	},
	client: {
		endpoints: {
    	pictures: 'http://api.mygram.com/picture',
      users: 'http://api.mygram.com/user',
      auth: 'http://api.mygram.com/auth'
  	}
	},
	auth: {
		facebook: {
			clientId: process.env.FACEBOOK_CLIENT_ID,
			clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
			callbackURL: 'http://mygramphoto.com/auth/facebook/callback'
		}
	},
	secret: process.env.MYGRAM_SECRET || 'platzi'
}

if (process.env.NODE_ENV !== 'production') {
	config.client.endpoints = {
		pictures: 'http://localhost:5000',
    users: 'http://localhost:5001',
    auth: 'http://localhost:5002'
	},
	config.auth.facebook.callbackURL = 'http://mygramphoto.test:5050/auth/facebook/callback'
}

module.exports = config;