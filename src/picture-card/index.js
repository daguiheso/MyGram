var yo = require('yo-yo');

module.exports = function (pic) {
	return yo `<div class="card">
				    <div class="card-image">
				    	<img class="activator" src="${pic.url}">
				    </div>
				    <div class="card-content">
				    	<a href="/user/${pic.user.username}" class="card-title">
				    		<img src="${pic.user.avatar}" class="avatar" alt="" />
				    		<span class="username">${pic.user.username}</span>
				    	</a>
				    	<small class="right time">Hace 1 día</small>
				    	<p>
				    		<a href="#" class="left">
				    			<i class="left fa fa-heart-o" aria-hidden="true"></i>
				    			<span class="left likes">${pic.likes} me gusta</span>
				    		</a>
				    	</p>
				    </div>
			    </div>`;
} 