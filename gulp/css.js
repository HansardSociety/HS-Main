// Gulp
import gulp from "gulp"
import concat from "gulp-concat"
import gulpif from "gulp-if"
import sass from "gulp-sass"
import lazypipe from "lazypipe"

// PostCSS
import postcss from "gulp-postcss"
import autoprefixer from "autoprefixer"
import mqpacker from "css-mqpacker"
import reporter from "postcss-reporter"
import scss from "postcss-scss"
import stylelint from "stylelint"

// Custom
import { PATH, ENV } from "./_config"
import { revStream } from "./rev"

// PostCSS (default)
const postcssDefaultPlugins = [
  autoprefixer({ browsers: [ "last 2 versions" ] }),
  mqpacker({ sort: true })
];

// PostCSS production plugins
const postcssProdPlugins = [
  autoprefixer({ browsers: [ "last 2 versions" ] }),
  mqpacker({ sort: true })
];

// PostCSS stream
const postcssStream = lazypipe().pipe(function() {
  return gulpif(ENV.prod,
    postcss(postcssDefaultPlugins.concat(postcssProdPlugins)),
    postcss(postcssDefaultPlugins))
});

// Loop through files
const css = () => {
  const files = [
    PATH.css.main,
    PATH.css.snipcart,
    PATH.css.vendor
  ]

  Object.keys(files).map((entry) => {

    const isSCSS = !Array.isArray(files[entry])
                   && files[entry].split(".").pop() == "scss"

    return gulp.src(files[entry])
      .pipe(gulpif(
        isSCSS,
        sass().on("error", sass.logError),
        concat("vendor.css")
      ))
      .pipe(postcssStream())
      .pipe(revStream())
      .pipe(gulp.dest(PATH.tmp.dir))
  })
}

export { css }
