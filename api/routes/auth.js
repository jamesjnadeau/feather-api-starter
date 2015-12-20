var express = require('express');
var router = express.Router();
var logger = require('_local/utils/logger');
var User = require('_local/models/user');
var passport = require('passport');

router.get('/login', function(req, res, next) {
  res.render('auth/login');
});

router.post('/login', passport.authenticate('local'), function(req, res) {
  res.redirect('/');
});

router.get('/register', function(req, res, next) {
  res.render('auth/register');
});

router.post('/register', function(req, res, next) {
  var form = req.body;
  var user = new User({
    username: req.body.username
  });
  //user passport-local-mongoose function to register user
  User.register(user, req.body.password, function(err) {
    if(err) {
      return next(err);
    }
    //res.flash();
    res.redirect('/');
  });
});



module.exports = router;
