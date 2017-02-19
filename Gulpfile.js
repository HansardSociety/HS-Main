// Inspiration from https://github.com/NathanBowers/mm-template/

var
////////////////////////////////////////////////////////////
//  Plugins
////////////////////////////////////////////////////////////

  path = require('path'),

  // Plugins
  gulp = require('gulp'),
  concat = require('gulp-concat'),
  browserSync = require('browser-sync').create(),
  runSequence = require('run-sequence'),
  sass = require('gulp-sass'),
  touch = require('gulp-touch'),

  // Babel
  babel = require('gulp-babel'),

  // PostCSS
  postcss = require('gulp-postcss'),
  autoprefixer = require('autoprefixer'),
  reporter = require('postcss-reporter'),
  scss = require('postcss-scss'),
  stylelint = require('stylelint'),

////////////////////////////////////////////////////////////
//  Postcss
////////////////////////////////////////////////////////////

  // PostCss options
  postcssOpts = {
    autoprefixer: {
      browsers: [ 'last 2 versions' ]
    }
  },

////////////////////////////////////////////////////////////
//  Paths
////////////////////////////////////////////////////////////

  PATH = {
    source: __dirname + '/source',
    css: {
      all: __dirname + '/source/assets/css/**/*.scss',
      main: __dirname + '/source/assets/css/main.scss',
      vendor: [
        __dirname + '/node_modules/normalize.css/normalize.css'
      ]
    },
    js: {
      main: __dirname + '/source/assets/js/main.js',
      vendor: [
        __dirname + '/node_modules/picturefill/dist/picturefill.js'
      ]
    },
    tmp: {
      dir: __dirname + '/.tmp',
      css: __dirname + '/.tmp/main.css',
      js: __dirname + '/.tmp/main.js',
    },
    build: __dirname + '/build',
    npm: __dirname + '/node_modules',
  }
; // END var

////////////////////////////////////////////////////////////
//  CSS
////////////////////////////////////////////////////////////

// Build
gulp.task('css:main', function() {
  return gulp.src(PATH.css.main)
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer(postcssOpts.autoprefixer)
    ]))
    .pipe(gulp.dest(PATH.tmp.dir));
});
gulp.task('css:vendor', function() {
  return gulp.src(PATH.css.vendor)
    .pipe(concat('vendor.css'))
    .pipe(gulp.dest(PATH.tmp.dir));
});

// Lint
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

////////////////////////////////////////////////////////////
//  Javascript
////////////////////////////////////////////////////////////

// Build
gulp.task('js:main', function() {
  return gulp.src(PATH.js.main)
    .pipe(babel({
      presets: [ 'es2015' ]
    }))
    .pipe(gulp.dest(PATH.tmp.dir));
});
gulp.task('js:vendor', function() {
  return gulp.src(PATH.js.vendor)
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest(PATH.tmp.dir));
});

////////////////////////////////////////////////////////////
//  Server
////////////////////////////////////////////////////////////

gulp.task('watch', [ 'css:main', 'js:main' ], function(gulpCallback) {

  browserSync.init({
    proxy: 'http://localhost:4567', // Middleman server
    open: false,
    reloadDelay: 100, // Concurrency fix
    reloadDebounce: 500, // Concurrency fix
    reloadOnRestart: true,
    files: [
      PATH.tmp.css,
      PATH.tmp.js,
      __dirname + '/source/**/*.slim'
    ],
    port: 7000,
    ui: { port: 7001 }
  }
  // Server running...
  ,function callback() {
    // Inject CSS/ JS
    gulp.watch(PATH.css.all, [ 'css:main' ]);
    gulp.watch(PATH.js.main, [ 'js:main' ]);

    // Reload browserSync after html changes
    gulp.watch(path.join(PATH.source, '**/*.slim'))
      .on('change', browserSync.reload);

    gulpCallback();
  });
});

////////////////////////////////////////////////////////////
//  Task-flows
////////////////////////////////////////////////////////////

gulp.task('default', function(cb) {
  runSequence('css:main', 'js:main', [ 'watch' ], cb);
});

gulp.task('build', function(cb) {
  runSequence('css:main', 'css:vendor', 'js:main', 'js:vendor', cb);
});

gulp.task('lint', function(cb) {
  runSequence('lint:css', cb);
});
