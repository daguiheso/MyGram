var gulp = require('gulp');
var sass = require('gulp-sass');
var rename = require('gulp-rename');


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

/*default tarea*/
gulp.task('default', ['styles', 'assets'])