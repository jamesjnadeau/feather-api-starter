var mongoose = require('_local/utils/mongoose');
var logger = require('_local/utils/logger.js');
module.exports = function(next) {
  var app = this;

  var connection = mongoose();

  connection.on('error', function(err) {
    logger.error('mongo connection error: %s', err.message || err);
    next(err);
  });

  connection.on('open', function() {
    logger.info('mongo connected');
    next();
  });
}
