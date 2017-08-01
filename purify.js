const purifycss = require("purify-css")

let content = [
  "build/prod/blog/**.html"
]
let css = [ "./build/prod/main-*.css" ]
let options = {
  output: "./build/nope.css",
  rejected: true
}
purifycss(content, css, options)
