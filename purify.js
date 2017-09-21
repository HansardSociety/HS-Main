const purifycss = require('purify-css')
const assetHashes = require('./source/assets/rev-manifest.json')

var htmlFiles = [
  "build/prod/blog.html"
]

var cssFiles = [ "build/prod/main-*.css" ]

var options = {
  // output: `./build/prod/${ assetHashes["main.css"] }`,
  output: `some.css`,
  minify: true,
  whitelist: [
    'JS-*', 'swiper', 'carousel*'
  ]
}

purifycss(htmlFiles, cssFiles, options)
