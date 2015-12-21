var feathers = require('feathers');
var hooks = require('feathers-hooks');

module.exports = function() {
  var app = this;
  // Enable hooks to services
  app.configure(hooks());
};
