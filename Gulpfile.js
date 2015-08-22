var gulp = require("gulp");
var server = require('gulp-develop-server');
var runSequence = require('run-sequence');
var $gulp = require('gulp-load-plugins')({
	lazy: false
});
var inject = require('gulp-inject');
var exec = require('child_process').exec;
var argv = require('yargs').argv;
var builder = require('jspm');
var del = require('del');
var path = require('path');

var scripts = ['client/app/*.js'];


gulp.task('karma', function(cb) {

	var Server = require('karma').Server;
	var config = {
		configFile: path.join(__dirname, '/karma.conf.js'),
		singleRun: false,
		autoWatch: true
	};

	var server = new Server(config, null);
	server.start();
	cb();
});

/* Run gulp test:server --harmony */
gulp.task('test:server', function () {
	"use strict";
	return gulp.src('server/**/*.spec.js')
		.pipe($gulp.mocha({reporter: 'spec'}))
		.on('error', $gulp.util.log);
});


gulp.task('watch', function () {
	"use strict";
	if (!argv.production) {
		gulp.watch(['server/**/*.js'], ['server:restart']);
		gulp.watch([
			'client/index.html', 'client/app/**/*.js', 'client/app/**/*.html'
		], $gulp.livereload.changed);
	}
});

gulp.task('server:start', function () {
	"use strict";
	var mode = argv.production ? 'production' : 'development';
	server.listen({
			path: 'server/app.js',
			execArgv: ['--harmony', '--use_strict'],
			env: { PORT: 5000, NODE_ENV: mode }
		},
		$gulp.livereload.listen);
});

gulp.task('server:restart', function () {
	server.changed(function (error) {
		if (!error) $gulp.livereload.changed();
	});
});

/* Run "gulp --production" if want to run in production mode (files served from build folder) */
gulp.task('default', function () {
	runSequence('server:start', 'watch');
});




/* Distribution tasks */
gulp.task('clean', function(cb) {
	del([
		'build', 'temp'
	], cb);
});

gulp.task('build:js', function (cb) {
	builder.bundleSFX('app/app', 'temp/app.js', { minify: true, mangle: true }).then(function(output) {
		cb();
	});
});

gulp.task('cache-bust', function() {
	return gulp.src('temp/app.js')
		.pipe($gulp.rev())
		.pipe(gulp.dest('build'));
});

gulp.task('html', function () {
	return gulp.src('client/index.html')
		.pipe(inject(gulp.src(['build/app*.js'], {read: false}), {addRootSlash: false, ignorePath: 'build'}))
		.pipe(gulp.dest('build/'));
});

gulp.task('dist', function () {
	runSequence('clean', 'build:js', 'cache-bust', 'html');
});
