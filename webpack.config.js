//Ensure env variables are available.
require('dotenv').load();

var webpack = require('webpack');
var pathUtil = require('path');
var jade = require('jade');

//Plugins
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var hotMiddlewareScript = 'webpack-hot-middleware/client?path=/__webpack_hmw&timeout=20000&reload=true&overlay=true';

//Globals - used across all packs
var resolve = {
  root: pathUtil.resolve(__dirname),
  alias: {
    notifyUtil: '_local/assets/js/utils/notify.js',
    errorUtil: '_local/assets/js/utils/error-notify.js',
  },
};

//Sanitized Env variables used throughout frontend Js
sanitizedEnv = JSON.stringify(require('_local/utils/sanitizedEnv'));
console.log('webpack ENV', sanitizedEnv);

module.exports = [
/*
 * Api
 */
  {
    //enable source-maps
    devtool: 'source-map',

    module: {
      loaders: [
        { test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader")
        },
        { test: /\.less$/, loader: "style-loader!css-loader!less-loader"},
        //taken from gowravshekar/bootstrap-webpack
        {test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/font-woff'},
        {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream'},
        {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file'},
        {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml'},
        //image-loader
        {
          test: /\.(jpe?g|png|gif|svg)$/i,
          loaders: [
              'file?hash=sha512&digest=hex&name=[hash].[ext]',
              'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
          ]
        }
      ],
    },
    entry: {
      'main': [__dirname+'/api/assets/js/index.js', ], //hotMiddlewareScript
      'styles': [__dirname+'/api/assets/css/index.js'], //hotMiddlewareScript
    },
    output: {
      filename: "[name].js",
      chunkFilename: "[id].js",
      path: __dirname+'/api/public/built/',
      libraryTarget: 'umd'
    },
    resolve: resolve,
    plugins: [
      //outputs all css to this file
      new ExtractTextPlugin("styles.css"),
      //make jQuery available everywhere
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "window.jQuery": "jquery",
      }),
      //define ENV variables
      new webpack.DefinePlugin({
        'env': sanitizedEnv,
      }),
      //webpack-hot-middleware
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),
    ]
  },
/*
 * Frontend
 */
  {
    //enable source-maps
    devtool: 'source-map',

    module: {
      loaders: [
        { test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader")
        },
        { test: /\.less$/, loader: "style-loader!css-loader!less-loader"},
        //taken from gowravshekar/bootstrap-webpack
        {test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/font-woff'},
        {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream'},
        {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file'},
        {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml'},
      ],
    },
    entry: {
      'main': [__dirname+'/frontend/assets/js/index.js'],
      'styles': [__dirname+'/frontend/assets/css/index.js'],
      'site-generator': 'static-site-loader!'+__dirname+'/frontend/content/index.js',
      'content-loader': '_local/contentPlugin!'+__dirname+'/frontend/content/index.js',
    },
    output: {
      filename: "[name].js",
      chunkFilename: "[id].js",
      path: __dirname+'/frontend/built/',
      libraryTarget: 'umd'
    },
    resolve: resolve,
    plugins: [
      //outputs all css to this file
      new ExtractTextPlugin("styles.css"),
      //make jQuery available everywhere
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "window.jQuery": "jquery"
      }),
      //define ENV variables
      new webpack.DefinePlugin({
        'env': sanitizedEnv,
      }),
      //webpack-hot-middleware
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),
    ],
    staticSiteLoader: {
      //perform any preprocessing tasks you might need here.
      preProcess: function(source, path) {
        //watch the content directory for changes
        this.addContextDependency(path);
        //watch the layouts directory for changes
        this.addContextDependency(__dirname+'/frontend/layouts/');
      },
      //Test if a file should be processed or not, should return a Boolean;
      testToInclude: function(path, stats, absPath) {
        return pathUtil.extname(path) === '.jade';
      },
      //Rewrite the url path used when written to output.path
      rewriteUrlPath: function(path, stats, absPath) {
        //strip out the extension
        var urlPath = path.slice(0, -5);
        //rewrite /index to be just /, making index.md files become the folder index properly
        urlPath = urlPath.replace('index', '');
        return urlPath;
      },
      processFile: function(file, content) {
        var local = {
          pretty: false,
          filename: file.absPath,
          API_URL: process.env.API_URL || false,
        };
        return jade.render(content, local);
      }
    }
  }
];
