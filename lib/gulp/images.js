import gulp from "gulp"
import sprite from "gulp-svg-sprite"

import { PATH } from "./_config"

/*		=SVG sprite
  ========================================================================== */

const icons = [
  "android-download",
  "android-search",
  "android-star-outline",
  "arrow-graph-up-right",
  "book",
  "bookmark",
  "chevron-down",
  "chevron-right",
  "chevron-left",
  "close-round",
  "calendar",
  "cube",
  "email",
  "headphone",
  "ios-arrow-thin-down",
  "ios-paper",
  "ios-videocam",
  "map",
  "social-twitter",
  "social-facebook",
  "social-linkedin"
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
    .pipe(gulp.dest(PATH.images))
}

export { iconSprite }
