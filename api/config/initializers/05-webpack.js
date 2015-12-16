var webpack = require('webpack');
var webpackConfig = require(process.env.WEBPACK_CONFIG ? process.env.WEBPACK_CONFIG : '../../../webpack.config');
//Use the first config array item only, the api
webpackConfig = webpackConfig[0];
var compiler = webpack(webpackConfig);


 module.exports = function() {
  var app = this;
  if (app.get('env') === 'development') {
    // Step 2: Attach the dev middleware to the compiler & the server
    app.use(require("webpack-dev-middleware")(compiler, {
      noInfo: true,
      publicPath: '/built',
      overlay: true,
    }));

    // Step 3: Attach the hot middleware to the compiler & the server
    app.use(require("webpack-hot-middleware")(compiler, {
      log: console.log, path: '/__webpack_hmw', heartbeat: 10 * 1000
    }));
  }
};
