const fs = require("fs")
const uncss = require("uncss")
const hashedAssets = require("../../source/assets/rev-manifest.json")

const ENV = process.env.NODE_ENV
const isProd = (ENV === "prod")

/*		=HTML files
  ========================================================================== */

const buildDir = `./build/${ isProd ? "prod" : "preview" }/`
const html = [
  buildDir + "*.html",
  buildDir + "about/*.html",
  buildDir + "blog/*.html",
  buildDir + "events/*.html",
  buildDir + "intelligence/*.html",
  buildDir + "legal/*.html",
  buildDir + "research/*.html",
  buildDir + "resources/*.html"
]

/*		=UnCSS options
  ========================================================================== */

/* Assets must be relative to HTML input */

const opts = {
  htmlroot: buildDir,

  csspath: "/assets/styles/", /* absolute path for nested html docs */
  stylesheets: [
    hashedAssets["main.css"]
  ],
  ignoreSheets: [
    hashedAssets["vendor.css"],
    hashedAssets["snipcart.css"]
  ],
  ignore: [
    /JS-/, /.AJAX-/, ".b-lazy", "swiper"
  ],

  report: false
}

/*		=Generate CSS
  ========================================================================== */

const cssDest = `${ buildDir }/assets/styles/${ hashedAssets["main.css"] }`

uncss(html, opts, function(err, out) {
  fs.writeFile(cssDest, out, function(err) {
    if (err) return console.log("ERROR ======> ")
  })
})
