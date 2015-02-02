(function () {

	'use strict';

	var gulp = require('gulp');
	var stylish = require('jshint-stylish');

	var jshint = require('gulp-jshint'),
		rename = require('gulp-rename'),
		uglify = require('gulp-uglify'),
		sourcemaps = require('gulp-sourcemaps'),
		inlinesource = require('gulp-inline-source');

	var DEBUG = (process.env.DEBUG === 'true');

	console.log(DEBUG);

	gulp.task('mllembed', function () {

		return gulp.src('mllembed.js')
			.pipe(jshint())
			.pipe(jshint.reporter(stylish))
			.pipe(sourcemaps.init())
			.pipe(uglify({
				compress: {
					'global_defs': {
						'DEBUG': DEBUG
					}
				}
			}))
			.pipe(rename('mllembed.min.js'))
			.pipe(sourcemaps.write('.'))
			.pipe(gulp.dest('.'));

	});

	gulp.task('mllembed-loader', function () {

		return gulp.src('mllembed-loader.js')
			.pipe(jshint())
			.pipe(jshint.reporter(stylish))
			.pipe(uglify({
				output: {
					'beautify': true,
					'space_colon': false,
					'indent_level': 4
				},
				compress: {
					'hoist_vars': true,
					'global_defs': {
						'DEBUG': DEBUG
					}
				}
			}))
			.pipe(rename('mllembed-loader.min.js'))
			.pipe(gulp.dest('.'));

	});

	gulp.task('examples', function () {

		return gulp.src('examples/src/*.html')
			.pipe(inlinesource({
				compress: false
			}))
			.pipe(gulp.dest('examples/'));

	});

	gulp.task('gulpfile', function () {

		return gulp.src('gulpfile.js')
			.pipe(jshint())
			.pipe(jshint.reporter(stylish));

	});

	gulp.task('watch', function () {

		gulp.watch('mllembed.js', ['mllembed']);

		gulp.watch('mllembed-loader.js', ['mllembed-loader']);

	});

	gulp.task('default', ['gulpfile', 'mllembed', 'mllembed-loader', 'examples']);

}());