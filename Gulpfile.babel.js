// Inspiration from https://github.com/NathanBowers/mm-template/

var
////////////////////////////////////////////////////////////
//  Plugins
////////////////////////////////////////////////////////////

  // Environments
  ENV          = process.env.NODE_ENV,

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
  rev          = require('gulp-rev'),
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
//  Sprite
////////////////////////////////////////////////////////////

  // Icons (Ionicons)
  iconsList =
    'android-search|' +
    'chevron-down|' +
    'chevron-right|' +
    'chevron-left|' +
    'social-twitter|' +
    'social-facebook|' +
    'social-linkedin|' +
    'email|' +
    'headphone|' +
    'ios-videocam|' +
    'book|' +
    'android-download|' +
    'close-round|' +
    'ios-paper|',

  // Sprite config
  svgSpriteConfig = {
    mode: {
      symbol: {
        dest: '.'
      }
    },
    svg: {
      doctypeDeclaration: false,
      xmlDeclaration: false,
      rootAttributes: {
        style: 'display:none;position:absolute;left:-9999px;'
      }
    }
  },

////////////////////////////////////////////////////////////
//  Paths
////////////////////////////////////////////////////////////

  PATH = {
    source: __dirname + '/source',
    assets: __dirname + '/source/assets',
    css: {
      all: __dirname + '/source/assets/css/**/*.scss',
      main: __dirname + '/source/assets/css/main.scss',
      vendor: [
        __dirname + '/node_modules/normalize.css/normalize.css',
        __dirname + '/node_modules/swiper/dist/css/swiper.css'
      ]
    },
    js: {
      main: __dirname + '/source/assets/js/main.js',
      vendor: __dirname + '/source/assets/js/vendor.js'
    },
    fonts: __dirname + '/source/assets/fonts/**.*',
    images: {
      icons: __dirname + `/source/assets/images/ionicons/?(${ iconsList }).svg`
    },
    redirects: __dirname + '/source/netlify-redirects',
    tmp: {
      dir: __dirname + '/.tmp',
      css: __dirname + '/.tmp/main.css',
      js: __dirname + '/.tmp/main.js',
    },
    build: __dirname + '/build',
  }
; // END vars

////////////////////////////////////////////////////////////
//  Server
////////////////////////////////////////////////////////////

gulp.task('watch',
  [ 'css:main', 'css:vendor', 'js:bundle', 'copy' ],

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

function cacheHash() {
  return gutil.env.GULP_ENV === 'production'
    ? rev()
    : gutil.noop();
}

function cacheManifest() {
  return gutil.env.GULP_ENV === 'production'
    ? rev.manifest({ merge: true })
    : gutil.noop();
}

// Main
gulp.task('css:main', function() {
  return gulp.src(PATH.css.main)
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer(postcssOpts.autoprefixer),
      mqpacker(postcssOpts.mqpacker)
    ]))
    .pipe(cacheHash())
    .pipe(gulp.dest(PATH.tmp.dir))
    .pipe(cacheManifest())
    .pipe(gulp.dest(PATH.tmp.dir));
});

// Vendor
gulp.task('css:vendor', function() {
  return gulp.src(PATH.css.vendor)
    .pipe(concat('vendor.css'))
    .pipe(cacheHash())
    .pipe(gulp.dest(PATH.tmp.dir))
    .pipe(cacheManifest())
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
//  Copy to build directory
////////////////////////////////////////////////////////////

gulp.task('copy', function() {
  return gulp.src([PATH.fonts, PATH.redirects])
    .pipe(gulp.dest(PATH.tmp.dir));
});

////////////////////////////////////////////////////////////
//  Task-flows
////////////////////////////////////////////////////////////

gulp.task('default', function(cb) {
  runSequence([ 'watch' ], cb);
});

gulp.task('build', function(cb) {
  runSequence('css:main', 'css:vendor', 'js:bundle', 'copy', cb);
});

gulp.task('lint', function(cb) {
  runSequence('lint:css', cb);
});
