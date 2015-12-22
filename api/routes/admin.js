var express = require('express');
var router = express.Router();
var logger = require('_local/utils/logger');
var fs = require('fs');

/* GET index page. */
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

//this should be last
module.exports = router;
