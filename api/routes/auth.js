var express = require('express');
var router = express.Router();
var logger = require('_local/utils/logger');
var User = require('_local/models/user');
var passport = require('passport');

var buckets = require('_local/utils/aws-buckets')
var fileService = require('_local/services/file');
var crypto = require('crypto');

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
    console.log(req.query);
    var params = {
      Key: relPath,
      ACL: 'public-read',
      ContentType: req.body.type,
      //WebsiteRedirectLocation: process.env.API_URL+'auth/file/save/'+result._id,
    };

    buckets.storage.getSignedUrl('putObject', params, function(err, data) {
      //return just what we need from the result
      res.json({
        _id: result._id,
        //putURL: url,
        signed_request: data,
        url: 'https://'+process.env.AWS_STORAGE_BUCKET+'.s3.amazonaws.com/'+relPath,
        relPath: relPath,
      });
    });
  });
});

router.get('/file/save/:id', function(req, res, next) {
  var patch = {
    status: 'uploaded'
  }
  fileService.patch(req.query.id, patch, function(err, result) {
    if(result.length) {
      var record = result
    }
  });
});


module.exports = router;
