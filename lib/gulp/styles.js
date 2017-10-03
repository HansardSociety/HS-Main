// Gulp
import gulp from "gulp"
import concat from "gulp-concat"
import csso from "gulp-csso"
import sass from "gulp-sass"
import lazypipe from "lazypipe"

// PostCSS
import postcss from "gulp-postcss"
import autoprefixer from "autoprefixer"
import stylelint from "stylelint"

// Custom
import { PATH, ENV } from "./_config"
import { revStream } from "./rev"

// PostCSS Options
const postcssPlugins = [
  autoprefixer({ browsers: ["last 2 versions"] })
]

// Loop through files
const css = () => {
  const files = [
    PATH.css.main,
    PATH.css.snipcart,
    PATH.css.vendor
  ]

  const allCSS = () => {

    for (var entry of files) {
      const isMainCSS = !Array.isArray(entry)

      gulp.src(entry)
        .pipe(
          isMainCSS
          ? sass().on("error", sass.logError)
          : concat("vendor.css")
        )
        .pipe(postcss(postcssPlugins))
        .pipe(csso({
          forceMediaMerge: true
        }))
        .pipe(revStream())
    }
  }

  return allCSS()
}

export { css }
