var yo = require('yo-yo');

if (!window.Intl) {
    window.Intl = require('intl'); // polyfill for `Intl`
    require('intl/locale-data/jsonp/en-US.js');
    require('intl/locale-data/jsonp/es.js');
}

var IntlRelativeFormat = window.IntlRelativeFormat = require('intl-relativeformat');

require('intl-relativeformat/dist/locale-data/en.js');
require('intl-relativeformat/dist/locale-data/es.js');

var rf = new IntlRelativeFormat('en-US');

module.exports = function pictureCard(pic) {
	var el;
	/*estamos pisando pic*/
	function render (picture) {
		return yo `<div class="card ${picture.liked ? 'liked' : ''}">
					    <div class="card-image">
					    	<img class="activator" src="${picture.url}">
					    </div>
					    <div class="card-content">
					    	<a href="/user/${picture.user.username}" class="card-title">
					    		<img src="${picture.user.avatar}" class="avatar" alt="" />
					    		<span class="username">${picture.user.username}</span>
					    	</a>
					    	<small class="right time">${rf.format(picture.createdAt)}</small>
					    	<p>
					    		<a href="#" class="left" onclick=${like.bind(null, true)}>
					    			<i class="fa fa-heart-o" aria-hidden="true"></i>
					    		</a>
					    		<a href="#" class="left" onclick=${like.bind(null, false)}>
					    			<i class="fa fa-heart" aria-hidden="true"></i>
					    		</a>
				    			<span class="left likes">${picture.likes} me gusta</span>
					    	</p>
					    </div>
				    </div>`
	}

    function like (liked) {
    	pic.liked = liked;
    	pic.likes += liked ? 1 : -1;
    	var newEl = render(pic);
    	yo.update(el, newEl);
    	return false; /*quita comportamiento default de tag a*/
    }    

    el = render(pic);
    return el;
} 