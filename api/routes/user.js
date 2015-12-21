var mongoose = require('_local/utils/mongoose');
var model = require('_local/models/user');
var path = require('path');
var serviceName = __filename.slice(__filename.lastIndexOf(path.sep)+1, module.filename.length -3);

var feathersMongoose = require('feathers-mongoose');
var Proto = require('uberproto');
var feathersCount = require('_local/feathers/count');

var MongooseService = feathersMongoose.Service.extend({
  _setup: function(app, path) {
    var self = this;
    var model = this.model

    //Count - mostly taken from find, used to get the total count of a query.
    app.get('/' + path + '/count', function(req, res, next) {
      console.log('here');
      feathersCount(self, model, req, res, next);
    });
  }
});

var service = Proto.create.call(MongooseService, serviceName,  model, { connection: mongoose });

module.exports = service;
/*
module.exports = new MongooseService(serviceName, model, {
  connection: mongoose,
  _setup: function(app, path) {
    var self = this;
    var model = this.model

    //Add Count - mostly taken from find, used to get the total count of a query.
    app.get('/' + path + '/count', function(req, res, next) {
      console.log('here');
      feathersCount(self, model, req, res, next);
    });
  }
});
*/
