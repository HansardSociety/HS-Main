const fs = require("fs")
const uglify = require("uglify-js");
const hashedAssets = require("../../source/assets/rev-manifest.json")

// Envs
const ENV = process.env.NODE_ENV
const isProd = (ENV === "prod")

// JS dir/ file
const scriptsDir = `./build/${ isProd ? "prod" : "preview" }/assets/scripts/`
const mainJS = scriptsDir + hashedAssets["main.js"]

// Uglify options
const opts = {
  compress: {
    unsafe: true,
    unused: true
  },
  mangle: {
    toplevel: true
  }
}

// Set code var
var jsCode = ""

// Create stream
const stream = fs.createReadStream(mainJS, "utf8")

// Run
stream.on("data", function(chunk) {

  jsCode += chunk

}).on("end", function() {

  const out = uglify.minify(jsCode, opts)
  const compiledJS = out.code

  fs.writeFile("zzz.js", compiledJS, function(err) {
    if (err) return console.log("ERROR ======> ")
  })
})

