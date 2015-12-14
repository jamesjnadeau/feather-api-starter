
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//Express logging
var log4js = require('log4js');
var logger = log4js.getLogger();
var connectLogger = log4js.connectLogger(logger, { level: 'auto' });

module.exports = function() {
  var app = this;
  // uncomment after placing your favicon in /public
  //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
  app.use(connectLogger);
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
};
