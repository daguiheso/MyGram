var yo = require('yo-yo');
var translate = require('../translate');

module.exports = function pictureCard(pic) {
	var el;
	/*estamos pisando pic*/
	function render (picture) {
		return yo `<div class="card ${picture.liked ? 'liked' : ''}">
					    <div class="card-image">
					    	<img class="activator" src="${picture.src}">
					    </div>
					    <div class="card-content">
					    	<a href="/${picture.user.username}" class="card-title">
					    		<img src="${picture.user.avatar}" class="avatar" alt="" />
					    		<span class="username">${picture.user.name}</span>
					    	</a>
					    	<small class="right time">${translate.date.format(new Date (picture.createdAt).getTime())}</small>
					    	<p>
					    		<a href="#" class="left" onclick=${like.bind(null, true)}>
					    			<i class="fa fa-heart-o" aria-hidden="true"></i>
					    		</a>
					    		<a href="#" class="left" onclick=${like.bind(null, false)}>
					    			<i class="fa fa-heart" aria-hidden="true"></i>
					    		</a>
				    			<span class="left likes">${translate.message('likes', { likes: picture.likes || 0 })}</span>
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

/*translate.message('likes',picture.likes) => likes es el string a traducir*/