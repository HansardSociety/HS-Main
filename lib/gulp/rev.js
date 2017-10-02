import gulp from "gulp"
import gulpif from "gulp-if"
import lazypipe from "lazypipe"
import rev from "gulp-rev"

import { PATH, ENV } from "./_config"

const opts = {
  merge: true,
  base: PATH.assets,
  path: `${ PATH.assets }/rev-manifest.json`
}

const revStream = lazypipe()
  .pipe(() => {
    return gulpif(ENV.prod, rev())
  })
  .pipe(gulp.dest, PATH.tmp.dir)
  .pipe(() => {
    return gulpif(ENV.prod, rev.manifest(opts))
  })
  .pipe(() => {
    return gulpif(ENV.prod, gulp.dest(PATH.assets))
  })

export { revStream }
