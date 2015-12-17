var feathers = require('feathers');

module.exports = function() {
  var app = this;
  // Enable REST services
  app.configure(feathers.rest());
};
