const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = [{
  entry: "./index",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "watermark.js",
    library: "watermark",
    libraryTarget: "umd"
  },
  optimization: {
    minimize: false
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        },
        include: [
          path.resolve(__dirname, "lib")
        ]
      }
    ]
  }
},{
  entry: "./index",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "watermark.min.js",
    library: "watermark",
    libraryTarget: "umd"
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin()
    ]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        },
        include: [
          path.resolve(__dirname, "lib")
        ]
      }
    ]
  }
}]
