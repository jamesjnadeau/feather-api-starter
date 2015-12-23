
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var sanitizedEvn = require('_local/utils/sanitizedEnv');

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

  //define locals for template
  app.locals.env = sanitizedEvn;
  app.use(function(req, res, next){
    res.locals.req = req;
    next();
  });
};
