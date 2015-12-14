var flash = require('connect-flash');

module.exports = function() {
  var app = this;
  // add flash message support
  app.use(flash());
}
