const purifycss = require('purify-css')
const assetHashes = require('./source/assets/rev-manifest.json')

const ENV = process.env.NODE_ENV

var htmlFiles = [
  "build/{prod,preview}/*.html",
  "build/{prod,preview}/**/*.html"
]

var cssFiles = [ "build/{prod,preview}/main-*.css" ]

var options = {
  output: `./build/${ ENV == "prod" ? "prod" : "preview" }/${ assetHashes["main.css"] }`,

  // output: `some.css`,
  minify: true,
  whitelist: [
    'JS-*', 'swiper', 'carousel*'
  ]
}

purifycss(htmlFiles, cssFiles, options)
