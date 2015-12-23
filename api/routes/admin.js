var express = require('express');
var router = express.Router();
var logger = require('_local/utils/logger');
var fs = require('fs');
var authUtil = require('_local/utils/auth');


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
  res.render('admin/jsoneditor', {
    models: models
  });
});

router.get('/content/create/:type', function(req, res, next) {
  res.json('hi');
})

//this should be last
module.exports = router;
