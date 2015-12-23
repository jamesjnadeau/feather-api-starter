var logger = require('_local/utils/logger');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var normalizeUtil = require('_local/utils/normalize')();

var maxAge = 24 * 60 * 60 * 1000; //24 hours
var packageName = require('../../../package').name;
var redisSettings = {
  host: process.env.REDIS_HOST || 'localhost',
  port: normalizeUtil.port(process.env.REDIS_PORT || '6379'),
  maxAge: process.env.REDIS_MAXAGE || maxAge,
  prefix: process.env.REDIS_PREFIX || packageName,
  resave: false,
  saveUninitialized: false,
};

var sessionSettings = {
  secret: process.env.SESSION_SECRET || 'y8GgNmWtMujFNcAY0sQf',
  key: process.env.SESSION_KEY ||'VS2WnUjlLreAJAwubuJu',
  cookie: { maxAge: maxAge },
  domain: process.env.COOKIE_DOMAIN  || 'localhost',
  store: false, //this is set below once redis is connected
  resave: true,
  saveUninitialized: false,
}

module.exports = function(next) {
  var app = this;
  var connection = new RedisStore(redisSettings)

  connection.on('error', function(err) {
    logger.error('redis connection error: %s', err.message || err);
    next(err);
  })

  connection.on('connect', function() {
    logger.info('redis connected');
    sessionSettings.store = connection;
    app.use(session(sessionSettings));
    next();
  })

};
