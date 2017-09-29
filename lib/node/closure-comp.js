const fs = require("fs")
const compile = require("google-closure-compiler-js").compile
const hashedAssets = require("../../source/assets/rev-manifest.json")

// Envs
const ENV = process.env.NODE_ENV
const isProd = (ENV === "prod")

// JS dir/ file
const scriptsDir = `./build/${ isProd ? "prod" : "preview" }/assets/scripts/`
const mainJS = scriptsDir + hashedAssets["main.js"]

// Set code var
var jsCode = ""

// Create stream
const stream = fs.createReadStream("./z1.js", "utf8")

// Run
stream.on("data", function(chunk) {

  jsCode += chunk

  console.log(jsCode)

}).on("end", function() {

  const flags = {
    jsCode: [{ src: jsCode }],
    languageIn: "ES5",
    compilationLevel: "SIMPLE"
  }

  const jsCodeCompiled = compile(flags).compiledCode

  fs.writeFile("z.js", jsCodeCompiled, function(err) {
    if (err) return console.log("ERROR ======> ")
  })
})

/**
 * Links:
 * http://stackabuse.com/read-files-with-node-js/
 */
