const fs = require("fs")
const uncss = require("uncss")
const yaml = require("js-yaml")
const hashedAssets = require("../../source/assets/rev-manifest.json")

const ENV = process.env.NODE_ENV
const isProd = (ENV === "prod")

/*		=HTML files
  ========================================================================== */

const data = fs.readFileSync("./data/hs/universal/5mkIBy6FCEk8GkOGKEQKi4.yaml", "utf8")
const loadYaml = yaml.safeLoad(data)
const urlsArr = loadYaml[":uncss_urls"].split("\n")
const buildDir = `./build/${ isProd ? "prod" : "preview" }`
const urls = urlsArr.map(url => buildDir + url)
console.log(urls)



// const buildDir = `./build/${ isProd ? "prod" : "preview" }/`
// const html = [
//   buildDir + "*.html",
//   buildDir + "about/*.html",
//   buildDir + "blog/*.html",
//   buildDir + "events/*.html",
//   buildDir + "intelligence/*.html",
//   buildDir + "legal/*.html",
//   buildDir + "research/*.html",
//   buildDir + "resources/*.html"
// ]

// /*		=UnCSS options
//   ========================================================================== */

// /* Assets must be relative to HTML input */

// const opts = {
//   htmlroot: buildDir,

//   csspath: "/assets/styles/", /* absolute path for nested html docs */
//   stylesheets: [
//     hashedAssets["app.css"]
//   ],
//   ignoreSheets: [
//     hashedAssets["vendor.css"],
//     hashedAssets["snipcart.css"]
//   ],
//   ignore: [
//     /JS-/, /.AJAX-/, ".b-lazy", "swiper"
//   ],

//   report: false
// }

// /*		=Generate CSS
//   ========================================================================== */

// const cssDest = `${ buildDir }/assets/styles/${ hashedAssets["app.css"] }`

// uncss(html, opts, function(err, out) {
//   fs.writeFile(cssDest, out, function(err) {
//     if (err) return console.log("ERROR ======> ")
//   })
// })
