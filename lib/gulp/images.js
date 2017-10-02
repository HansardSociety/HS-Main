import gulp from "gulp"
import sprite from "gulp-svg-sprite"

import { PATH } from "./_config"


/*		=SVG sprite
  ========================================================================== */

const icons = [
  "android-search",
  "ios-arrow-thin-down",
  "chevron-down",
  "chevron-right",
  "chevron-left",
  "arrow-graph-up-right",
  "bookmark",
  "calendar",
  "cube",
  "map",
  "social-twitter",
  "social-facebook",
  "social-linkedin",
  "email",
  "headphone",
  "ios-videocam",
  "book",
  "android-download",
  "close-round",
  "ios-paper"
]

const iconsRegEx = icons.join("|")

// Sprite options
const spriteOpts = {
  mode: {
    symbol: {
      dest: "."
    }
  },
  svg: {
    doctypeDeclaration: false,
    xmlDeclaration: false,
    rootAttributes: {
      style: "display:none;"
    }
  }
}

const iconSprite = () => {

  return gulp.src(`${ PATH.images }/ionicons/?(${ iconsRegEx }).svg`)
    .pipe(sprite(spriteOpts))
    .pipe(gulp.dest(PATH.tmp.images))
}

export { iconSprite }
