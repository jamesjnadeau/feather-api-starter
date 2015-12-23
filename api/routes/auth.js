var express = require('express');
var router = express.Router();
var logger = require('_local/utils/logger');
var User = require('_local/models/user');
var passport = require('passport');
var authUtil = require('_local/utils/auth');

var buckets = require('_local/utils/aws-buckets');
var fileService = require('_local/services/file');
var userService = require('_local/services/user');
var crypto = require('crypto');

router.get('/login', function(req, res, next) {
  res.render('auth/login');
});

router.post('/login', passport.authenticate('local'), function(req, res) {
  res.redirect('/');
});

router.get('/logout', function(req, res, next) {
  req.logout();
  console.log('logout', req.user);
  res.redirect('/');
});


router.get('/register', function(req, res, next) {
  if(req.user) {
    res.redirect('/user');
  } else {
    res.render('auth/register');
  }
});

router.post('/register', function(req, res, next) {
  var form = req.body;
  var user = new User({
    username: req.body.username
  });
  //use passport-local-mongoose function to register user
  User.register(user, req.body.password, function(err, newUser) {

    if(err) {
      return next(err);
    }
    //res.flash();
    res.redirect('/auth/user');
  });
});

//Helper function to return the currently signed in user as json
router.get('/user', function(req, res, next) {
  if(req.isAuthenticated()) {
    res.json(req.user);
  } else {
    next(Error('Not Authenticated'));
  }

});

router.post('/file/put', function(req, res, next) {
  //generate a new url prefix to use for this file
  //This helps distributed the files across s3's "hd"
  //and makes looking for files easier by hand
  var prefix = crypto.randomBytes(1).toString('hex');
  var record = {
    prefix: prefix,
    size: req.body.size
  }

  //get a new file object to store the item
  fileService.create(record, function(err, result) {
    //Generate relative path here as well, virtuals don't seem to work for the result...
    var relPath = result.prefix+'/'+result._id.toHexString();
    //Generate url for put operation
    var params = {
      Key: relPath,
      ACL: 'public-read',
      ContentType: req.body.type,
    };

    buckets.storage.getSignedUrl('putObject', params, function(err, data) {
      //return just what we need from the result
      res.json({
        _id: result._id,
        //this is the url used to upload to s3
        signedRequest: data,
        //and some urls to hit when everything goes as planned
        url: 'https://'+process.env.AWS_STORAGE_BUCKET+'.s3.amazonaws.com/'+relPath,
        successURL: process.env.API_URL+'/auth/file/save/'+result._id,
        relPath: relPath,
      });
    });
  });
});

router.get('/file/save/:id', function(req, res, next) {
  var patch = {
    status: 'uploaded'
  }
  fileService.patch(req.params.id, patch, function(err, record) {
    res.json(record);
  });
});


module.exports = router;
