import webpack from "webpack"
import merge from "webpack-merge"
import ClosureCompilerPlugin from "webpack-closure-compiler"

// Core config
const coreConfig = () => {
  return {
    output: {
      filename: "[name].js"
    },
    module: {
      rules: [{
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      }]
    },
    plugins: [
      new webpack.optimize.CommonsChunkPlugin({
        name: "vendor"
      })
    ]
  }
}

// Production config
const prodConfig = () => {
  return {
    plugins: [
      new ClosureCompilerPlugin({
        compiler: {
          language_in: "ECMASCRIPT5",
          // language_out: "ECMASCRIPT5",
          compilation_level: "SIMPLE"
        },
        jsCompiler: true
      })
    ]
  }
}

// Run
const config = env => {
  if (env.prod) return merge(coreConfig(), prodConfig())
  return coreConfig()
}

export { config }
