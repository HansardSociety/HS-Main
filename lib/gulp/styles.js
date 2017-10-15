// Gulp
import gulp from "gulp"
import concat from "gulp-concat"
import csso from "gulp-csso"
import sass from "gulp-sass"
import lazypipe from "lazypipe"

// PostCSS
import postcss from "gulp-postcss"
import autoprefixer from "autoprefixer"

// Custom
import { PATH, ENV } from "./_config"
import { revStream } from "./rev"

// PostCSS Options
const postcssPlugins = [
  autoprefixer({ browsers: ["last 2 versions"] })
]

// CSSO options
const cssoOpts = {
  forceMediaMerge: true
}

// Loop through files
const css = ({ files, scss }) => {

  return gulp.src(files)
    .pipe(
      scss
      ? sass().on("error", sass.logError)
      : concat("vendor.css")
    )
    .pipe(postcss(postcssPlugins))
    .pipe(csso(cssoOpts))
    .pipe(revStream())
}

const customCSS = () => css({
  files: PATH.css.custom,
  scss: true
})

const vendorCSS = () => css({
  files: PATH.css.vendor,
  scss: false
})

export { customCSS, vendorCSS }
