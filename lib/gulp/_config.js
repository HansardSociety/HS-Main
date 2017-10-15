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
const tmp = `${ cwd }/.tmp/assets`
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
    custom: [
      `${ css }/app.scss`,
      `${ css }/vendors/snipcart/snipcart.scss`
    ],
    vendor: [
      `${ nodeModules }/normalize.css/normalize.css`,
      `${ nodeModules }/flickity/dist/flickity.css`
    ]
  },
  js: {
    all: `${ js }/**/*.js`,
    bundles: [
      `${ js }/app.js`,
      `${ js }/vendor.js`
    ]
  },
  views: {
    all: `${ views }/**/*.slim`
  },
  images: images
}

export { PATH, ENV }
