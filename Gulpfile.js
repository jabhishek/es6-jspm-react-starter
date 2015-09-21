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
var eslint = require("gulp-eslint");
var minify = require("gulp-minify");
var minifyCss = require("gulp-minify-css");
var autoprefixer = require('gulp-autoprefixer');

var scripts = ['client/app/*.js'];

var config = {
	source: {
		js: {
			app: 'client/app/**/*.js',
			server: 'server/**/*.js'
		},
		css: {
			app: ['client/assets/app.css'],
			vendors: ['client/jspm_packages/github/twbs/bootstrap@3.3.5/css/bootstrap.css']
		},
		less: ['client/assets/app.less']
	}
};

gulp.task('less', function() {
	return gulp.src(config.source.less)
		.pipe($gulp.less())
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
		.pipe(gulp.dest('client/assets'));
});

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

gulp.task("lint", function() {
	return gulp.src(config.source.js.app)
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failOnError());
});

gulp.task('watch', function () {
	"use strict";
	if (!argv.production) {
		gulp.watch([config.source.js.server], ['server:restart']);
		gulp.watch([config.source.js.app], ['lint']);
		gulp.watch(['client/assets/**/*.less'], ['less']);
		gulp.watch([
			'client/index.html', config.source.css.app, config.source.js.app
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
	runSequence('less', 'server:start', 'watch');
});



/* Distribution tasks */
gulp.task('clean', function(cb) {
	del([
		'build', 'temp'
	], cb);
});

gulp.task('build:js', function (cb) {
	builder.bundleSFX('app/main', 'temp/app.js', { minify: true, mangle: true }).then(function(output) {
		cb();
	});
});

gulp.task('build:css', ['less'], function () {
	return gulp.src(config.source.css.app)
		.pipe(minifyCss())
		.pipe($gulp.rev())
		.pipe(gulp.dest('build'));
});

gulp.task('cache-bust', function() {
	return gulp.src('temp/app.js')
		.pipe($gulp.rev())
		.pipe(gulp.dest('build'));
});

gulp.task('html', function () {
	return gulp.src('client/index.html')
		.pipe(inject(gulp.src(['build/app*.js'], {read: false}), {addRootSlash: false, ignorePath: 'build'}))
		.pipe(inject(gulp.src(['build/*.css'], {read: false}), {addRootSlash: false, ignorePath: 'build'}))
		.pipe(gulp.dest('build/'));
});

gulp.task('dist', function () {
	runSequence('clean', ['build:js', 'build:css'], 'cache-bust', 'html');
});
