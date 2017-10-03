import gulp from "gulp"
import babel from "gulp-babel"
import concat from "gulp-concat"
import gulpif from "gulp-if"
import plumber from "gulp-plumber"
import uglify from "gulp-uglify"

import { PATH, ENV } from "./_config"
import { revStream } from "./rev"

const uglifyOpts = {
  toplevel: true,
  compress: {
    unsafe: true
  }
}

const js = () => {
  const modules = PATH.js.modules

  Object.keys(modules).map(bundle => {
    const out = `${ bundle }.js`
    const mainJS = (bundle == "main")

    return gulp.src(modules[bundle])
      .pipe(concat(out))
      .pipe(gulpif(mainJS, babel({ presets: ["env"] })))
      .pipe(gulpif(ENV.prod, uglify(uglifyOpts))))
      .pipe(revStream())
  })
}

export { js }
