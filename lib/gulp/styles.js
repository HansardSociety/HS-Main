// Node
import fs from "fs"
import yaml from "js-yaml"

// Gulp
import gulp from "gulp"
import concat from "gulp-concat"
import csso from "gulp-csso"
import gulpif from "gulp-if"
import sass from "gulp-sass"
import sassEnv from "gulp-sass-variables"
import lazypipe from "lazypipe"

// PostCSS
import postcss from "gulp-postcss"
import autoprefixer from "autoprefixer"

// Custom
import { PATH, ENV } from "./_config"
import { revStream } from "./rev"

/*		=PostCSS plugins
  ========================================================================== */

const postcssPlugins_1 = [
  autoprefixer({ browsers: ["last 4 versions"] })
]

const postcssPlugins_2 = [].concat(postcssPlugins_1)

/*		=CSSO options
  ========================================================================== */

const cssoOpts = {
  forceMediaMerge: true
}

/*		=Tasks
  ========================================================================== */

const css = ({ files, scss }) => {

  return gulp.src(files)
    .pipe(sassEnv({
      $env: ENV.prod ? "production" : "development"
    }))
    .pipe(scss
      ? sass().on("error", sass.logError)
      : concat("vendor.css"))
    .pipe(ENV.prod
      ? postcss(postcssPlugins_2)
      : postcss(postcssPlugins_1))
    .pipe(csso(cssoOpts))
    .pipe(revStream())
}

const cssApp = () => css({
  files: PATH.css.app,
  scss: true
})

const cssVendor = () => css({
  files: PATH.css.vendor,
  scss: true
})

export { cssApp, cssVendor }
