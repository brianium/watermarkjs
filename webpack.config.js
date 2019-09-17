const path = require('path');

module.exports = {
  entry: "./index",
  output: {
    path: __dirname + "/dist",
    filename: "watermark.js",
    library: "watermark",
    libraryTarget: "umd"
  },
  module: {
    loaders: [
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
