const purifycss = require("purify-css")
const hash = require('./source/assets/rev-manifest')

let content = [
  "build/prod/blog/**.html"
]
let css = [ "./build/prod/main-*.css" ]
let options = {
  output: `./build/prod/${ hash["main.css"] }`,
  rejected: true
}
purifycss(content, css, options)
