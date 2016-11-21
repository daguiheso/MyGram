import page from 'page'
import headermidderware from '../header'
import title from 'title'
import empty from 'empty-element'
import template from './template'
import utils from '../utils'

page('/:username', loadUser, utils.loadAuth, headermidderware, function (ctx, next) {
	var main = document.getElementById('main-container')
	title(`Platzigram - ${ctx.user.username}`); /* obteniendo del contexto el parametro*/
	empty(main).appendChild(template(ctx.user))
	/* no llamamos a next() porque queremos que se resuelva esta ruta*/
})

page('/:username/:id', loadUser, utils.loadAuth, headermidderware, function (ctx, next) {
	var main = document.getElementById('main-container')
	title(`Platzigram - ${ctx.user.username}`); /* obteniendo del contexto el parametro*/
	empty(main).appendChild(template(ctx.user))
	/* no llamamos a next() porque queremos que se resuelva esta ruta*/
	$(`#modal${ctx.params.id}`).openModal({
		complete: function () {
			page(`/${ctx.params.username}`)
		}
	});
})

async function loadUser (ctx, next) {
	try {
		/* await se usa para hacer un llamado asincronico dentro de una function async
		   fetch() recien cuando devuelva el resultado del servidor (no se queda esperando el resultado)
		   devulve la ejecucion a este momento y se le pasa la ruta a la que se hara fetch y devuelve
		   una promesa en formato json
		  */
		ctx.user = await fetch(`/api/user/${ctx.params.username}`).then(res => res.json())
		next()
	} catch (err) {
		console.log(err)
	}
}