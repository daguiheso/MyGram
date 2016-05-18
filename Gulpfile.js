var gulp = require('gulp');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var babel = require('babelify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');


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

/*procesar src/index.js y lo transforme utilizando browserify y bebelify*/
gulp.task('scripts', function () {
	browserify('./src/index.js') /*ruta de archivo que browserify procesara*/
		.transform(babel)  /*que lo transforme utilizando babel - sin esta linea no utilizariamos ecma6*/
		.bundle()  /*genera ese bundle*/
		.pipe(source('index.js')) /* transformacion de lo que nos mando bundle() de browserify para que lo entienda gulp*/
		.pipe(rename('app.js'))
		.pipe(gulp.dest('public'))
})

/*default tarea*/
gulp.task('default', ['styles', 'assets', 'scripts'])