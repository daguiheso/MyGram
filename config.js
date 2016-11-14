'use strict'

const config = {
	aws: {
		accessKey: process.env.AWS_ACCESS_KEY,
		secretKey: process.env.AWS_SECRET_KEY
	},
	secret: process.env.MYGRAM_SECRET
}

module.exports = config;