var page = require('page');
var empty = require('empty-element');
var template = require('./template');
var title = require('title');


page('/', function (ctx, next) {
	title('MyGram');
	var main = document.getElementById('main-container');

	var pictures = [
		{
			user: {
				username: 'Daniel H',
				avatar: 'https://scontent-mia1-1.xx.fbcdn.net/v/t1.0-9/12963889_10208901904603330_6870354961841214887_n.jpg?oh=f819a022e52be19cabaabd89d6cb39ce&oe=57E6B7F5'
			},
			url: 'http://materializecss.com/images/office.jpg',
			likes: 4,
			liked: true,
			createdAt: new Date()
		},
		{
			user: {
				username: 'David Pte',
				avatar: 'https://scontent-mia1-1.xx.fbcdn.net/v/t1.0-9/13240476_10207468828932980_766208754586076978_n.jpg?oh=ae997f0f10403f65499674f5a2869757&oe=579DE806'
			},
			url: 'http://materializecss.com/images/office.jpg',
			likes: 10,
			liked: false,
			createdAt: new Date().setDate(new Date().getDate() - 10)
		}
	];

	empty(main).appendChild(template(pictures));
})