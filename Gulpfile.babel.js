// Inspiration from https://github.com/NathanBowers/mm-template/

const path         = require("path");

const gulp         = require("gulp");
const gulpif       = require("gulp-if");
const babel        = require("gulp-babel");
const browserSync  = require("browser-sync").create();
const browserify   = require("browserify");
const concat       = require("gulp-concat");
const es           = require("event-stream");
const gutil        = require("gulp-util");
const gzip         = require("gulp-gzip");
const lazypipe     = require("lazypipe");
const rev          = require("gulp-rev");
const runSequence  = require("run-sequence");
const sass         = require("gulp-sass");
const source       = require("vinyl-source-stream");
const streamify    = require("gulp-streamify");
const svgSprite    = require("gulp-svg-sprite");
const touch        = require("gulp-touch");
const uglify       = require("gulp-uglify");

const postcss      = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssnano      = require("cssnano");
const mqpacker     = require("css-mqpacker");
const reporter     = require("postcss-reporter");
const scss         = require("postcss-scss");
const stylelint    = require("stylelint");

const ENV          = gutil.env.GULP_ENV;
const isProd       = ENV == "production";
const isDev        = ENV == "development";

/*		=SVG sprite
  ========================================================================== */

// Icons (Ionicons)
const iconsList =
  "android-search|" +
  "ios-arrow-thin-down|" +
  "chevron-down|" +
  "chevron-right|" +
  "chevron-left|" +
  "arrow-graph-up-right|" +
  "bookmark|" +
  "calendar|" +
  "cube|" +
  "map|" +
  "social-twitter|" +
  "social-facebook|" +
  "social-linkedin|" +
  "email|" +
  "headphone|" +
  "ios-videocam|" +
  "book|" +
  "android-download|" +
  "close-round|" +
  "ios-paper|";

// Sprite config
const svgSpriteConfig = {
  mode: {
    symbol: {
      dest: "."
    }
  },
  svg: {
    doctypeDeclaration: false,
    xmlDeclaration: false,
    rootAttributes: {
      style: "display:none;"
    }
  }
};

/*		=Paths
  ========================================================================== */

const PATH = {
  source: __dirname + "/source",
  assets: __dirname + "/source/assets",
  css: {
    all: __dirname + "/source/assets/css/**/*.scss",
    main: __dirname + "/source/assets/css/main.scss",
    vendor: [
      __dirname + "/node_modules/normalize.css/normalize.css",
      __dirname + "/node_modules/swiper/dist/css/swiper.css"
    ],
    snipcart: __dirname + "/source/assets/css/vendors/snipcart/snipcart.scss"
  },
  js: {
    all: __dirname + "/source/assets/js/**/*.js",
    main: __dirname + "/source/assets/js/main.js",
    vendor: __dirname + "/source/assets/js/vendor.js"
  },
  images: {
    icons: __dirname + `/source/assets/images/ionicons/?(${ iconsList }).svg`
  },
  tmp: {
    dir: __dirname + "/.tmp/assets",
    assets: __dirname + "/.tmp/assets",
    css: __dirname + "/.tmp/assets/main.css",
    js: __dirname + "/.tmp/assets/main.js",
  },
  build: {
    dir: __dirname + "/build",
    assets: __dirname + "/build/assets"
  }
};

/*		=Dev server
  ========================================================================== */

gulp.task("watch",
  [ "css:main", "css:snipcart", "css:vendor", "js:bundle" ],

  function(gulpCallback) {

    browserSync.init({
      proxy: "http://localhost:4567", // Middleman server
      open: false,
      reloadDelay: 100, // Concurrency fix
      reloadDebounce: 500, // Concurrency fix
      reloadOnRestart: true,
      files: [
        PATH.tmp.css,
        PATH.tmp.snipcart,
        PATH.tmp.js,
        __dirname + "/source/**/*.slim"
      ],
      port: 7000,
      ui: { port: 7001 }
    },

    // Server running...
    function callback() {

      // Inject CSS/ JS
      gulp.watch(PATH.css.all, [ "css:main", "css:snipcart" ]);
      gulp.watch(PATH.js.all, [ "js:bundle" ]);

      // Reload browserSync after html changes
      gulp.watch(path.join(PATH.source, "**/*.slim"))
        .on("change", browserSync.reload);

      gulpCallback();
    }
  );
});

/*		=Caching
  ========================================================================== */

// Asset caching manifest options
const manifestOpts = {
  merge: true,
  base: "source/assets",
  path: "source/assets/rev-manifest.json"
};

// Asset caching
const assetCachingStream = lazypipe()
  .pipe(function() {
    return gulpif(isProd, rev())
  })
  .pipe(gulp.dest, PATH.tmp.dir)
  .pipe(function() {
    return gulpif(isProd, rev.manifest(manifestOpts))
  })
  .pipe(function() {
    return gulpif(isProd, gulp.dest(PATH.assets))
  });

/*		=CSS
  ========================================================================== */

// const cssnanoOpts =

// PostCSS (default)
const postcssDefaultPlugins = [
  autoprefixer({ browsers: [ "last 2 versions" ] }),
  mqpacker({ sort: true })
];

// PostCSS production plugins
const postcssProdPlugins = [
  autoprefixer({ browsers: [ "last 2 versions" ] }),
  mqpacker({ sort: true })
  // cssnano({ preset: "default" })
];

// PostCSS stream
const postcssStream = lazypipe().pipe(function() {
  return gulpif(isProd,
    postcss(postcssDefaultPlugins.concat(postcssProdPlugins)),
    postcss(postcssDefaultPlugins))
});

// Main CSS
gulp.task("css:main", function() {
  return gulp.src(PATH.css.main)
    .pipe(sass().on("error", sass.logError))
    .pipe(postcssStream())
    .pipe(assetCachingStream());
});

// Snipcart CSS
gulp.task("css:snipcart", function() {
  return gulp.src(PATH.css.snipcart)
    .pipe(sass().on("error", sass.logError))
    .pipe(postcssStream())
    .pipe(assetCachingStream());
});

// Vendor CSS
gulp.task("css:vendor", function() {
  return gulp.src(PATH.css.vendor)
    .pipe(concat("vendor.css"))
    .pipe(postcss([
      cssnano({ preset: "default" })
    ]))
    .pipe(assetCachingStream());
});

// Lint CSS
gulp.task("css:lint", function() {
  return gulp.src(path.join(PATH.css, "**.scss"))
    .pipe(postcss(
      [
        stylelint(),
        reporter({ clearMessages: true })
      ], {
        syntax: scss
      }
    ));
});

/*		=Scripts
  ========================================================================== */

const uglifyStream = lazypipe().pipe(uglify);
gulp.task("js:bundle", function() {

  var files = [ PATH.js.main, PATH.js.vendor ];

  var tasks = files.map(function(entry) {
    return browserify({ entries: entry })
      .transform("babelify")
      .bundle()
      .on("error", function(e) { gutil.log(e); })
      .pipe(source(entry.split("/").pop()))
      .pipe(streamify(function() {
        return gulpif(isProd, uglify())
      }))
      .pipe(streamify(assetCachingStream()));
  });

  return es.merge(tasks);
});

/*		=Images
  ========================================================================== */

gulp.task("svg", function() {
  return gulp.src(PATH.images.icons)
    .pipe(svgSprite(svgSpriteConfig))
    .pipe(gulp.dest("./source/assets/images"));
});

/*		=Sequences
  ========================================================================== */

gulp.task("default", function(cb) {
  runSequence(["watch"], cb);
});

gulp.task("assets", function(cb) {
  runSequence("css:main", "css:snipcart", "css:vendor", "js:bundle", cb);
});

gulp.task("build", function(cb) {
  runSequence("assets", cb);
});

gulp.task("lint", function(cb) {
  runSequence("lint:css", cb);
});
