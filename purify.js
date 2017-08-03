const purifycss = require('purify-css')
const assetHashes = require('./source/assets/rev-manifest.json')

let htmlFiles = [
  "./build/prod/*.html",
  "./build/prod/events/*.html"
]

let cssFiles = [ "./build/prod/main-*.css" ]

let options = {
  output: `./build/prod/${ assetHashes["main.css"] }`,
  minify: true,
  whitelist: [
    'JS-*', 'swiper', 'carousel*'
  ]
}

purifycss(htmlFiles, cssFiles, options)
