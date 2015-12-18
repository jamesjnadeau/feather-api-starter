var passport = require('passport');
LocalStrategy = require('passport-local').Strategy;

var User = require('_local/models/user');


module.exports = function() {
  var app = this;
  app.use(passport.initialize());
  app.use(passport.session());

  // use static authenticate method of model in LocalStrategy
  passport.use(new LocalStrategy(User.authenticate()));

  // use static serialize and deserialize of model for passport session support
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());
}
