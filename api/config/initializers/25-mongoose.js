var mongoose = require('mongoose');
var logger = require('../../utils/logger');
//var logger = console;
var normalizeUtil = require('../../utils/normalize')();

var packageName = require('../../../package').name;
var settings = {
  host: process.env.MONGO_HOST || 'localhost',
  port: normalizeUtil.port(process.env.MONGO_PORT || '27017'),
  dbname: process.env.MONGO_DBNAME || packageName,
};

module.exports = function(next) {
  var app = this;

  var connection;
  connection = mongoose.createConnection(
    settings.host,
    settings.dbname + '-' + app.get('env'),
    settings.port
  );

  connection.on('error', function(err) {
    logger.error('mongo connection error: %s', err.message || err);
    next(err);
  })

  connection.on('open', function() {
    logger.info('mongo connection opened');
    next();
  })

  //this was in igloo, not sure why it's needed
  //connection = _.defaults(connection, mongoose);
  return connection;
}
