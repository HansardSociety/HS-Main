import webpack from "webpack"
import merge from "webpack-merge"
import UglifyPlugin from "uglifyjs-webpack-plugin"

// Core config
const config = () => {
  return {
    output: {
      filename: "[name].js"
    },
    module: {
      rules: [{
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              ["env", {
                "loose": true,
                "modules": false
              }]
            ]
          }
        }
      }]
    },
    plugins: [
      new webpack.optimize.CommonsChunkPlugin({
        name: "vendor"
      }),
      new UglifyPlugin()
    ]
  }
}

export { config }
