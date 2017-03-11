// Inspiration from https://github.com/NathanBowers/mm-template/

var
////////////////////////////////////////////////////////////
//  Plugins
////////////////////////////////////////////////////////////

  // Native
  path         = require('path'),

  // Plugins
  gulp         = require('gulp'),
  babel        = require('gulp-babel'),
  browserSync  = require('browser-sync').create(),
  browserify   = require('browserify'),
  concat       = require('gulp-concat'),
  es           = require('event-stream'),
  gutil        = require('gulp-util'),
  runSequence  = require('run-sequence'),
  sass         = require('gulp-sass'),
  source       = require('vinyl-source-stream'),
  svgSprite    = require('gulp-svg-sprite'),
  touch        = require('gulp-touch'),

  // PostCSS
  postcss      = require('gulp-postcss'),
  autoprefixer = require('autoprefixer'),
  mqpacker     = require('css-mqpacker'),
  reporter     = require('postcss-reporter'),
  scss         = require('postcss-scss'),
  stylelint    = require('stylelint'),

////////////////////////////////////////////////////////////
//  Postcss
////////////////////////////////////////////////////////////

  // PostCss options
  postcssOpts = {
    autoprefixer: {
      browsers: [ 'last 2 versions' ]
    },
    mqpacker: {
      sort: true
    }
  },

////////////////////////////////////////////////////////////
//  Sprites
////////////////////////////////////////////////////////////

  svgSpriteConfig = {
    mode: {
      symbol: {
        dest: '.'
      }
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
      vendor: __dirname + '/source/assets/js/vendor.js'
    },
    fonts: __dirname + '/source/assets/fonts/**.*',
    images: {
      icons: __dirname + '/node_modules/evil-icons/assets/icons/*.svg'
    },
    tmp: {
      dir: __dirname + '/.tmp',
      css: __dirname + '/.tmp/main.css',
      js: __dirname + '/.tmp/main.js',
    },
    build: __dirname + '/build',
  }
; // END var

////////////////////////////////////////////////////////////
//  Server
////////////////////////////////////////////////////////////

gulp.task('watch',
  [ 'css:main', 'css:vendor', 'js:bundle', 'fonts' ],

  function(gulpCallback) {

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
    },

    // Server running...
    function callback() {
      // Inject CSS/ JS
      gulp.watch(PATH.css.all, [ 'css:main' ]);
      gulp.watch(PATH.js.main, [ 'js:bundle' ]);

      // Reload browserSync after html changes
      gulp.watch(path.join(PATH.source, '**/*.slim'))
        .on('change', browserSync.reload);

      gulpCallback();
    }
  );
});

////////////////////////////////////////////////////////////
//  CSS
////////////////////////////////////////////////////////////

// Main
gulp.task('css:main', function() {
  return gulp.src(PATH.css.main)
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer(postcssOpts.autoprefixer),
      mqpacker(postcssOpts.mqpacker)
    ]))
    .pipe(gulp.dest(PATH.tmp.dir));
});

// Vendor
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

gulp.task('js:bundle', function() {

  var files = [ PATH.js.main, PATH.js.vendor ];

  var tasks = files.map(function(entry) {
    return browserify({ entries: entry })
      .transform('babelify')
      .bundle()
      .on('error', function(e) {
        gutil.log(e);
      })
      .pipe(source(entry.split('/').pop()))
      .pipe(gulp.dest(PATH.tmp.dir));
  });

  return es.merge(tasks);
});

////////////////////////////////////////////////////////////
//  Images
////////////////////////////////////////////////////////////

gulp.task('svg', function() {
  return gulp.src(PATH.images.icons)
    .pipe(svgSprite(svgSpriteConfig))
    .pipe(gulp.dest('./source/assets/images'));
});

////////////////////////////////////////////////////////////
//  Fonts
////////////////////////////////////////////////////////////

gulp.task('fonts', function() {
  return gulp.src(PATH.fonts)
    .pipe(gulp.dest(PATH.tmp.dir));
});

////////////////////////////////////////////////////////////
//  Task-flows
////////////////////////////////////////////////////////////

gulp.task('default', function(cb) {
  runSequence([ 'watch' ], cb);
});

gulp.task('build', function(cb) {
  runSequence('css:main', 'css:vendor', 'js:bundle', 'fonts', cb);
});

gulp.task('lint', function(cb) {
  runSequence('lint:css', cb);
});
