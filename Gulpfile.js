var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var runSequence = require('run-sequence');
var sass = require('gulp-sass');

// PostCSS
var postcss = require('gulp-postcss');
var reporter = require('postcss-reporter');
var scss = require('postcss-scss');
var stylelint = require('stylelint');

/*
** CSS
**************************************************/

gulp.task('css', function() {
  return gulp.src('./source/css/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./.tmp'));
});

gulp.task('lint:css', function() {
  return gulp.src('./source/css/**/*.scss')
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
    proxy: 'http://localhost:4567', /* Middleman server */
    open: false,
    reloadDelay: 100, /* Concurrency fix */
    reloadDebounce: 500, /* Concurrency fix */
    // reloadOnRestart: true,
    files: [
      './.tmp/main.css',
      './source/**/*.slim'
    ],
    /* BrowserSync proxy */
    port: 7000,
    /* BrowserSync UI */
    ui: { port: 7001 }
  }
  /**
   * Server running.
   * Begin watching files...
   */
  ,function callback() {
    gulp.watch('./source/css/**/*.(sass|scss)', [ 'css' ]);

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
