var webpack = require('webpack');

//Plugins
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  //enable source-maps
  devtool: 'source-map',

  module: {
    loaders: [
      { test: /\.css$/,
       //loader: "style-loader!css-loader"
       loader: ExtractTextPlugin.extract("style-loader", "css-loader")
      },
      { test: /\.less$/, loader: "style-loader!css-loader!less-loader"},

      //taken from gowravshekar/bootstrap-webpack
      // the url-loader uses DataUrls.
      // the file-loader emits files.
      {test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/font-woff'},
      {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream'},
      {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file'},
      {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml'},
    ],
  },
  entry: {
    'main': './assets/js/index.js',
    'styles': './assets/css/index.js'
  },
  output: {
    filename: "[name].js",
    chunkFilename: "[id].js",
    path: 'public/built',
    libraryTarget: 'umd'
  },
  plugins: [
    //outputs all css to this file
    new ExtractTextPlugin("styles.css"),
    //make jQuery available everywhere
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery"
    }),
  ]
}
