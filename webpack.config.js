const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: "./index",
  mode: 'development',
  output: {
    path: __dirname + "/dist",
    filename: "watermark.js",
    library: "watermark",
    libraryTarget: "umd"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [
          path.resolve(__dirname, "lib")
        ]
      }
    ]
  }
}
