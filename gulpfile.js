var gulp = require('gulp');

var jshint = require('gulp-jshint'),
	rename = require('gulp-rename'),
	uglify = require('gulp-uglify'),
	watch = require('gulp-watch');

gulp.task('default', function () {
	return gulp.src('embedder.js')
		.pipe(jshint())
		.pipe(jshint.reporter())
		.pipe(uglify())
		.pipe(rename('embedder.min.js'))
		.pipe(gulp.dest('.'));
});

gulp.task('watch', function () {
	gulp.watch('embedder.js', ['default'])
		.on('error', function () {
			
		});
});