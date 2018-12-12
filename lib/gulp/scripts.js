import gulp from "gulp"
import plumber from "gulp-plumber"
import named from "vinyl-named"

// Webpack
import webpack from "webpack"
import webpackStream from "webpack-stream"
import { config as webpackConfig } from "./webpack"

// Custom
import { PATH } from "./_config"
import { revStream } from "./rev"

const js = () => {
  return gulp.src(PATH.js.bundles)
    .pipe(plumber())
    .pipe(named())
    .pipe(webpackStream(webpackConfig(), webpack))
    .pipe(revStream())
}

export { js }
