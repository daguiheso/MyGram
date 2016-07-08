import page from 'page'
import headermidderware from '../header'
import title from 'title'
import empty from 'empty-element'
import template from './template'


page('/:username', headermidderware, function (ctx, next) {
	var main = document.getElementById('main-container')
	title(`${ctx.params.username}`) /* obteniendo del contexto el parametro*/
	empty(main).appendChild(template(ctx.params.username))
	/* no llamamos a next() porque queremos que se resuelva esta ruta*/
})