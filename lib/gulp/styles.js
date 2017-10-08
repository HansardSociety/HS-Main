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
const css = () => {
  const files = [
    PATH.css.app,
    PATH.css.snipcart,
    PATH.css.vendor
  ]

  const allCSS = () => {

    for (let entry of files) {
      const isAppCSS = !Array.isArray(entry)

      gulp.src(entry)
        .pipe(
          isAppCSS
          ? sass().on("error", sass.logError)
          : concat("vendor.css")
        )
        .pipe(postcss(postcssPlugins))
        .pipe(csso(cssoOpts))
        .pipe(revStream())
    }
  }

  return allCSS()
}

export { css }
