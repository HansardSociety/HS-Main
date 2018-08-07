// Node
import fs from "fs"
import yaml from "js-yaml"

// Gulp
import gulp from "gulp"
import concat from "gulp-concat"
import csso from "gulp-csso"
import gulpif from "gulp-if"
import sass from "gulp-sass"
import sassEnv from "gulp-sass-variables"
import lazypipe from "lazypipe"

// PostCSS
import postcss from "gulp-postcss"
import autoprefixer from "autoprefixer"
import uncss from "postcss-uncss"

// Custom
import { PATH, ENV } from "./_config"
import { revStream } from "./rev"

/*		=UnCSS
  ========================================================================== */

const htmlData = fs.readFileSync(PATH.css.uncssURLs, "utf8")
const loadYaml = yaml.safeLoad(htmlData)

var uncssSlugs = loadYaml[":uncss_urls"]
var tld = "hspreview.netlify.com" // use preview tld to ensure future styles
uncssSlugs = uncssSlugs.map(slug => `https://${ tld }${ slug }.html`)

const uncssOpts = {
  html: uncssSlugs,
  ignore: [
    // /^(?!\.grid|\.e).*$/,
    /^(\.JS|(?!\.grid|\.e)).*$/
  ],
  report: false,
  timeout: 0 // time to wait for JS eval (ie. 0 == no eval)
}

/*		=PostCSS plugins
  ========================================================================== */

const postcssPlugins_1 = [
  autoprefixer({ browsers: ["last 4 versions"] })
]

const postcssPlugins_2 = [
  uncss(uncssOpts)
].concat(postcssPlugins_1)

/*		=CSSO options
  ========================================================================== */

const cssoOpts = {
  forceMediaMerge: true
}

/*		=Tasks
  ========================================================================== */

const css = ({ files, scss, uncss }) => {

  return gulp.src(files)
    .pipe(sassEnv({
      $env: ENV.prod ? "production" : "development"
    }))
    .pipe(scss
      ? sass().on("error", sass.logError)
      : concat("vendor.css"))
    .pipe(uncss && ENV.prod
      ? postcss(postcssPlugins_2)
      : postcss(postcssPlugins_1))
    .pipe(csso(cssoOpts))
    .pipe(revStream())
}

const cssApp = () => css({
  files: PATH.css.app,
  scss: true,
  uncss: true
})

const cssVendor = () => css({
  files: PATH.css.vendor,
  scss: true,
  uncss: false
})

export { cssApp, cssVendor }
