import gulp from "gulp"
import svgMin from "gulp-svgmin"
import svgSprite from "gulp-svg-sprite"

import { PATH } from "./_config"

/* =SVG sprite
========================================================================== */

// https://ionicons.com/v2/
const icons = [
  "android-download",
  "android-search",
  "android-star-outline",
  "arrow-up-c",
  "arrow-down-c",
  "arrow-right-c",
  "arrow-graph-up-right",
  "bookmark",
  "checkmark",
  "chevron-down",
  "chevron-right",
  "chevron-left",
  "close-round",
  "calendar",
  "cube",
  "email",
  "headphone",
  "images",
  "ios-arrow-down",
  "ios-arrow-thin-up",
  "ios-arrow-thin-down",
  "ios-arrow-thin-right",
  "ios-book",
  "ios-cart",
  "ios-paper",
  "ios-videocam",
  "load-c",
  "link",
  "map",
  "minus-round",
  "plus-round",
  "quote",
  "social-twitter",
  "social-facebook",
  "social-linkedin"
]

const iconsRegEx = icons.join("|")

// Sprite options
const spriteOpts = {
  mode: {
    symbol: {
      dest: ".",
      sprite: "icon-sprite.svg"
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
    .pipe(svgMin())
    .pipe(svgSprite(spriteOpts))
    .pipe(gulp.dest(PATH.tmp.images))
}

/*		=Placeholders
  ========================================================================== */

const minSVG = () => {
  return gulp.src(`${ PATH.images }/placeholder/*.svg`)
    .pipe(svgMin())
    .pipe(gulp.dest(PATH.tmp.images))
}

export { iconSprite, minSVG }
