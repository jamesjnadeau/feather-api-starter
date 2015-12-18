var mongoose = require('_local/utils/mongoose');
var model = require('_local/models/content');
var MongooseService = require('feathers-mongoose');
var path = require('path');
var serviceName = __filename.slice(__filename.lastIndexOf(path.sep)+1, module.filename.length -3);
var service = new MongooseService(serviceName, model, { connection: mongoose });
module.exports = service;
