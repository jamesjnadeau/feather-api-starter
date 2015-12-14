var feathers = require('feathers');
var bootable = require('bootable');
var errorHandler = require('./utils/error-handler')

var app = bootable(feathers());

app.phase(bootable.initializers('./config/initializers'));
app.phase(bootable.routes('./routes/index.js'));

//Error Handler - Must be last
app.phase(errorHandler);

module.exports = app;
