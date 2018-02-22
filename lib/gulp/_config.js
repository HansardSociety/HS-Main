import gutil from "gulp-util"


/*		=Environments
  ========================================================================== */

const gulpEnv = gutil.env.GULP_ENV;
const ENV = {
  prod: gulpEnv == "production",
  dev: gulpEnv == "development"
}

/*		=Paths
  ========================================================================== */

const cwd = process.cwd()
const tmp = `${ cwd }/source/.assets`
const build = `${ cwd }/build`
const source = `${ cwd }/source`
const assets = `${ source }/assets`
const css = `${ assets }/css`
const js = `${ assets }/js`
const images = `${ assets }/images`
const views = `${ source }/views`
const nodeModules = `${ cwd }/node_modules`

const PATH = {
  tmp: {
    dir: tmp,
    dirCSS: `${ tmp }/styles`,
    dirJS: `${ tmp }/scripts`,
    css: `${ tmp }/app.css`,
    js: `${ tmp }/app.js`,
    images: `${ tmp }/images`,
  },
  build: {
    dir: build,
    assets: `${ build }/assets`
  },
  source: source,
  assets: assets,
  css: {
    all: `${ css }/**/*.scss`,
    app: `${ css }/app.scss`,
    vendor: `${ css }/vendor.scss`,
    uncssURLs: `${ cwd }/data/hs/universal/5mkIBy6FCEk8GkOGKEQKi4.yaml`
  },
  js: {
    all: `${ js }/**/*.js`,
    bundles: [
      `${ js }/app.js`,
      `${js}/checkout.js`,
      `${ js }/vendor.js`
    ]
  },
  views: {
    all: `${ views }/**/*.erb`,
    favicons: `${ views }/partials/favicons.slim`
  },
  images: images
}

export { PATH, ENV }
