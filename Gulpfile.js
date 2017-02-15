// Inspiration from https://github.com/NathanBowers/mm-template/

var
  path = require('path'),

  // Plugins
  gulp = require('gulp'),
  browserSync = require('browser-sync').create(),
  runSequence = require('run-sequence'),
  sass = require('gulp-sass'),
  touch = require('gulp-touch'),

  // PostCSS
  postcss = require('gulp-postcss'),
  reporter = require('postcss-reporter'),
  scss = require('postcss-scss'),
  stylelint = require('stylelint'),

  // Paths
  PATH = {
    source: path.join(__dirname, 'source'),
    css: path.join(__dirname, 'source/assets/css'),
    js: path.join(__dirname, 'source/assets/js'),
    tmp: path.join(__dirname, '.tmp'),
    build: path.join(__dirname, 'build')
  }
;

/*
** CSS
**************************************************/

gulp.task('css', function() {
  return gulp.src(path.join(PATH.css, '*.scss'))
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(PATH.tmp));
});

gulp.task('css:lint', function() {
  return gulp.src(path.join(PATH.css, '**.scss'))
    .pipe(postcss(
      [
        stylelint(),
        reporter({ clearMessages: true })
      ], {
        syntax: scss
      }
    ));
});

/*
** Server
**************************************************/

gulp.task('watch', [ 'css' ], function(gulpCallback) {

  browserSync.init({
    proxy: 'http://localhost:4567', // Middleman server
    open: false,
    reloadDelay: 100, // Concurrency fix
    reloadDebounce: 500, // Concurrency fix
    reloadOnRestart: true,
    files: [
      path.join(PATH.tmp, 'main.css'),
      __dirname + '/source/**/*.slim',
    ],
    port: 7000,
    ui: { port: 7001 }
  }
  // Server running...
  ,function callback() {
    gulp.watch(path.join(PATH.css, '**.scss'), [ 'css' ]);
    // Reload browserSync after html changes
    gulp.watch(path.join(PATH.source, '**/*.slim')).on('change', browserSync.reload);

    gulpCallback();
  });
});

/*
** Task-flows
**************************************************/

gulp.task('default', function(cb) {
  runSequence('css', [ 'watch' ], cb);
});

gulp.task('build', function(cb) {
  runSequence('css', cb);
});

gulp.task('lint', function(cb) {
  runSequence('lint:css', cb);
});
