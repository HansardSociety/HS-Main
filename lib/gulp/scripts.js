import gulp from "gulp"
import babel from "gulp-babel"
import concat from "gulp-concat"
import gulpif from "gulp-if"

import { PATH } from "./_config"
import { revStream } from "./rev"

const js = () => {
  const modules = PATH.js.modules

  Object.keys(modules).map(bundle => {

    return gulp.src(modules[bundle])
      .pipe(concat(`${ bundle }.js`))
      .pipe(gulpif(bundle == "main", babel({
        presets: ["env"]
      })))
      .pipe(revStream())
  })
}

export { js }
