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
    css: `${ tmp }/main.css`,
    js: `${ tmp }/main.js`,
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
    main: `${ css }/main.scss`,
    snipcart: `${ css }/vendors/snipcart/snipcart.scss`,
    vendor: [
      `${ nodeModules }/normalize.css/normalize.css`,
      `${ nodeModules }/swiper/dist/css/swiper.css`
    ]
  },
  js: {
    all: `${ js }/**/*.js`,
    main: `${ js }/main.js`,
    vendor: `${ js }/vendor.js`,
    modules: {
      vendor: [
        `${ nodeModules }/promise-polyfill/promise.js`,
        `${ nodeModules }/lodash/lodash.js`,
        `${ nodeModules }/picturefill/dist/picturefill.js`,
        `${ nodeModules }/whatwg-fetch/fetch.js`,
        `${ nodeModules }/swiper/dist/js/swiper.js`,
        `${ nodeModules }/smooth-scroll/dist/js/smooth-scroll.js`,
        `${ nodeModules }/blazy/blazy.js`,
      ],
      main: [
        `${ js }/core.js`,
        `${ js }/toggle-state.js`,
        `${ js }/nav.js`,
        `${ js }/ajax.js`,
        `${ js }/truncate.js`,
        `${ js }/misc.js`,
        `${ js }/lazy.js`,
        `${ js }/carousel.js`
      ]
    }
  },
  views: {
    all: `${ views }/**/*.slim`
  },
  images: images
}

export { PATH, ENV }
