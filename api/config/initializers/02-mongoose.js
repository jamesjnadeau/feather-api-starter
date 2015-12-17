var mongoose = require('../../../shared/utils/mongoose');
var logger = require('../../utils/logger.js');
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
