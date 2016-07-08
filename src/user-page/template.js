import yo from 'yo-yo'
import layout from '../layout'
import translate from '../translate'

export default function userPageTemplate(username) {
	var el = yo`<div class="container user-page">
						    <div class="row">
						      <div class="col s12 m10 offset-m1 l8 offset-l2 center-align heading">
						        <div class="row">
						          <div class="col s12 m10 offset-m1 l3 offset-l3 center">
						            <img src="https://pbs.twimg.com/profile_images/662655718181486592/w22nQBg_.jpg" alt="testimage" class="responsive-img circle" />
						          </div>
						          <div class="col s12 m10 offset-m1 l6 left-align">
						            <h2 class="hide-on-large-only center-align">${username}</h2>
						            <h2 class="hide-on-med-and-down left-align">${username}</h2>
						          </div>
						        </div>
						      </div>
						      <div class="row">
						        
						      </div>
						    </div>
						  </div>`;

	return layout(el)
}
