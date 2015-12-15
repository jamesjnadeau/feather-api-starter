var feathers = require('feathers');
var bootable = require('bootable');
var errorHandler = require('./utils/error-handler')

var app = bootable(feathers());

app.phase(bootable.initializers(__dirname+'/config/initializers'));
app.phase(bootable.routes(__dirname+'/routes/index.js'));

//Error Handler - Must be last
app.phase(errorHandler);

module.exports = app;
