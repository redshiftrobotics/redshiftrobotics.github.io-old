/* Code and directory layout courtesy of @markdalgleish's generator-bespoke */

var pkg = require('./package.json'),
	gulp = require('gulp'),
	gutil = require('gulp-util'),
	plumber = require('gulp-plumber'),
	rimraf = require('gulp-rimraf'),
	rename = require('gulp-rename'),
	connect = require('gulp-connect'),
	browserify = require('gulp-browserify'),
	uglify = require('gulp-uglify'),
	jade = require('gulp-jade'),
	stylus = require('gulp-stylus'),
	autoprefixer = require('gulp-autoprefixer'),
	csso = require('gulp-csso'),
	through = require('through'),
	opn = require('opn'),
	path = require('path');
	isDist = process.argv.indexOf('serve') === -1;

gulp.task('js', ['clean:js'], function() {
	return gulp.src('src/scripts/main.js')
		.pipe(isDist ? through() : plumber())
		.pipe(browserify({debug: !isDist }))
		.pipe(isDist ? uglify() : through())
		.pipe(rename('build.js'))
		.pipe(gulp.dest('build'))
		.pipe(connect.reload());
});

gulp.task('html', ['clean:html'], function() {
	return gulp.src('src/index.jade')
		.pipe(isDist ? through() : plumber())
		.pipe(jade({ pretty: true }))
		.pipe(rename('index.html'))
		.pipe(gulp.dest('.'))
		.pipe(connect.reload());
});

gulp.task('css', ['clean:css'], function() {
	return gulp.src('src/styles/main.styl')
		.pipe(isDist ? through() : plumber())
		.pipe(stylus({
			// Allow CSS to be imported from node_modules and bower_components
			'include css': true,
			'paths': ['./node_modules', './bower_components']
		}))
		.pipe(autoprefixer('last 2 versions', { map: false }))
		.pipe(isDist ? csso() : through())
		.pipe(rename('build.css'))
		.pipe(gulp.dest('build'))
		.pipe(connect.reload());
});

gulp.task('images', ['clean:images'], function() {
	return gulp.src('src/images/**/*')
		.pipe(gulp.dest('images'))
		.pipe(connect.reload());
});

gulp.task('clean', function() {
	return gulp.src('dist')
		.pipe(rimraf());
});

gulp.task('clean:html', function() {
	return gulp.src('index.html')
		.pipe(rimraf());
});

gulp.task('clean:js', function() {
	return gulp.src('build/build.js')
		.pipe(rimraf());
});

gulp.task('clean:css', function() {
	return gulp.src('build/build.css')
		.pipe(rimraf());
});

gulp.task('clean:images', function() {
	return gulp.src('images')
		.pipe(rimraf());
});

gulp.task('connect', ['build'], function(done) {
	connect.server({
		root: '.',
		livereload: true
	});

	opn('http://localhost:8080', done);
});

gulp.task('watch', function() {
	gulp.watch('src/**/*.jade', ['html']);
	gulp.watch('src/styles/**/*.styl', ['css']);
	gulp.watch('src/images/**/*', ['images']);
	gulp.watch([
		'src/scripts/**/*.js',
	], ['js']);
});

gulp.task('build', ['js', 'html', 'css', 'images']);
gulp.task('serve', ['connect', 'watch']);
gulp.task('default', ['build']);
