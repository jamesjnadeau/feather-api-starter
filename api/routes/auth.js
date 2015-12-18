var express = require('express');
var router = express.Router();
var logger = require('_local/utils/logger');

/* GET index page. */
router.get('/', function(req, res, next) {
  res.render('auth/login');
});

module.exports = router;
