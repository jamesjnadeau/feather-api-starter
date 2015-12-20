var feathers = require('feathers');
var hooks = require('feathers-hooks');
var bootable = require('bootable');
var errorHandler = require('./utils/error-handler')

var app = bootable(feathers().configure(hooks()));

app.phase(bootable.initializers(__dirname+'/config/initializers'));
app.phase(bootable.routes(__dirname+'/routes/index.js'));

//Error Handler - Must be last
app.phase(errorHandler);

module.exports = app;
