var logger = require('_local/utils/logger');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var normalizeUtil = require('_local/utils/normalize')();

var maxAge = 24 * 60 * 60 * 1000; //24 hours
var packageName = require('../../../package').name;
var settings = {
  host: process.env.REDIS_HOST || 'localhost',
  port: normalizeUtil.port(process.env.REDIS_PORT || '6379'),
  maxAge: process.env.REDIS_MAXAGE || maxAge,
  prefix: process.env.REDIS_PREFIX || packageName,
  resave: false,
  saveUninitialized: false,
};

var settings = {
  secret: 'y8GgNmWtMujFNcAY0sQf',
  key: 'VS2WnUjlLreAJAwubuJu',
  cookie: { maxAge: maxAge },
  store: false, //this is set below once redis is connected
}

module.exports = function(next) {
  var app = this;
  var connection = new RedisStore(settings)

  connection.on('error', function(err) {
    logger.error('redis connection error: %s', err.message || err);
    next(err);
  })

  connection.on('connect', function() {
    logger.info('redis connected');
    settings.store = connection;
    app.use(session(settings));
    next();
  })

};
