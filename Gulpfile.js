var gulp = require('gulp');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var babel = require('babelify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var watchify = require('watchify');


/*que tome nuestro file sass y lo compile a css*/
gulp.task('styles', function () {
	gulp
		.src('index.scss')
		.pipe(sass())
		.pipe(rename('app.css'))
		.pipe(gulp.dest('public'));
})

/*copiar files dentro de assets a folder public que autogenerará*/
gulp.task('assets', function () {
	gulp
		.src('assets/*')  /*apuntando a los archivos dentro se asstes*/
		.pipe(gulp.dest('public'));
})


function compile(watch) {
	var bundle = watchify(browserify('./src/index.js', {debug: true})) /*ruta de archivo que browserify procesara*/

	function rebundle() {
		bundle
			.transform(babel)  /*que lo transforme utilizando babel - sin esta linea no utilizariamos ecma6*/
			.bundle()  /*genera ese bundle*/
			.on('error', function (err) {console.log(err); this.emit('end')	})
			.pipe(source('index.js')) /* transformacion de lo que nos mando bundle() de browserify para que lo entienda gulp*/
			.pipe(rename('app.js'))
			.pipe(gulp.dest('public'))
	}

	if (watch) {
		bundle.on('update', function () {
			console.log('--> Bundling...');
			rebundle();
		})
	}
	
	rebundle();
}

/*procesar src/index.js y lo transforme utilizando browserify y bebelify*/
gulp.task('build', function () { 
	return compile(); 
});

/*procesar y se mantiene escuchando a src/index.js y lo transforme utilizando browserify y bebelify*/
gulp.task('watch', function () { 
	return compile(true); 
});

/*default tarea*/
gulp.task('default', ['styles', 'assets', 'build'])