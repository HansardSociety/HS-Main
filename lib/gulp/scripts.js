import gulp from "gulp"
import gulpif from "gulp-if"
import plumber from "gulp-plumber"
import named from "vinyl-named"

// Webpack
import webpack from "webpack"
import webpackStream from "webpack-stream"
import { config as webpackConfig } from "./webpack"

// Custom
import { PATH, ENV } from "./_config"
import { revStream } from "./rev"

// Uglify options
const uglifyOpts = {
  toplevel: true
}

const js = () => {
  // console.log(ENV)
  return gulp.src(PATH.js.bundles)
    .pipe(plumber())
    .pipe(named())
    .pipe(webpackStream(
      ENV.prod
        ? webpackConfig(ENV)
        : webpackConfig(ENV)
      , webpack
    ))
    .pipe(revStream())
}

export { js }