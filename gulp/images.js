import svgSprite from "gulp-svg-sprite"


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

const iconsRegEx = () => {
  for (var icon of icons) { return `${ icon }|` }
}

// Sprite config
const svgSpriteConfig = {
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
    .pipe(svgSprite(svgSpriteConfig))
    .pipe(gulp.dest(PATH.tmp.images))
}
