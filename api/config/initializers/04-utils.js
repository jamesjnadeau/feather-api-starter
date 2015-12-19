
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//Express logging
var log4js = require('log4js');
var logger = log4js.getLogger();
var connectLogger = log4js.connectLogger(logger, {
  level: 'auto',
  format: ':method :status :url in :response-time ms'
});

module.exports = function() {
  var app = this;
  // uncomment after placing your favicon in /public
  //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
  app.use(connectLogger);
  app.use(bodyParser.json());
  // Turn on URL-encoded parser for REST services
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser());
};
