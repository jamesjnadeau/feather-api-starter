
var passport = require('passport');
LocalStrategy = require('passport-local').Strategy;
var User = require('_local/models/user');

passport.initialize();

// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

module.exports = passport;
