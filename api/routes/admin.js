var express = require('express');
var router = express.Router();
var logger = require('_local/utils/logger');

/* GET index page. */
router.get('/jsoneditor', function(req, res, next) {
  //get a list of all the models we have...
  var models = ['content', 'user'];
  res.render('admin/jsoneditor', {
    models: models
  });
});

//this should be last
module.exports = router;
