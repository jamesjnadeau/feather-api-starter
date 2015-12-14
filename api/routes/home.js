var express = require('express');
var router = express.Router();
var logger = require('../utils/logger');

/* GET index page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

module.exports = router;
