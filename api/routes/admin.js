var express = require('express');
var router = express.Router();
var logger = require('_local/utils/logger');
var fs = require('fs');
var authUtil = require('_local/utils/auth');
var contentService = require('_local/services/content');


/*
Only Admins allowed!!!!
*/
router.use(authUtil.isAdmin);

/*
JSON Editor
NOTE this relies on the api,
so if you are having problems, check the api's permissions
*/
router.get('/jsoneditor', function(req, res, next) {
  //get a list of all the models we have...
  //var models = ['content', 'user'];
  var models = [];
  var files = fs.readdirSync(__dirname+'/../../node_modules/_local/models');
    for (var i in files){
      var name = files[i].slice(0, -3);;
      models.push(name);
    }
  res.render('admin/jsonEditor', {
    models: models
  });
});

router.get('/content/create/:type', function(req, res, next) {
  res.render('admin/contentCreator', {

  });
});

router.post('/content/create/:type', function(req, res, next) {
  var type = req.params.type;
  var record = {
    name: req.body.name,
    type: type,
    relPath: type+'/'+encodeURIComponent(req.body.path),
    fields: {
      title: '<h1>'+req.body.name+'</h1>',
    }
  };

  contentService.create(record, function(err, result) {
    if(err) {
      return next(err);
    }
    var redirectTo = process.env.STAGING_URL+'/'+result.relPath;
    console.log('redirecting to', redirectTo);
    res.redirect(redirectTo);
  });
})

//this should be last
module.exports = router;
