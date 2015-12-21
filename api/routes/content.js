var _ = require('lodash');
var mongoose = require('_local/utils/mongoose');
var model = require('_local/models/content');
var path = require('path');
var serviceName = __filename.slice(__filename.lastIndexOf(path.sep)+1, module.filename.length -3);
var feathersCount = require('_local/feathers/count');
var feathersMongoose = require('feathers-mongoose');
var Proto = require('uberproto');

var MongooseService = feathersMongoose.Service.extend({
    patch: function(id, data, params, cb) {
        if (_.isFunction(data)) {
          cb = data;
          return cb(new errors.BadRequest('You need to provide data to be updated'));
        }

        if (_.isFunction(params)) {
          cb = params;
          params = {};
        }
        console.log('data', data);

        // TODO (EK): Support updating multiple docs. Maybe we just use feathers-batch
        //this.model.findByIdAndUpdate(new ObjectId(id), data, {new: true}, function(error, data) {
        this.model.findById(id.toString(), function(error, result) {

          if (error) {
            return cb(new errors.BadRequest(error));
          }

          if (!result) {
            return cb(new errors.NotFound('No record found for id ' + id));
          }

          for(var key in data) {
            switch(typeof data[key]) {
              case 'object':
                result[key] = _.extend({}, result[key], data[key]);
                break;

              default:
                result[key] = data[key];
                break;
            }

          }
          console.log(result);

          result.save(function(err) {
            if (err) {
              return cb(new errors.BadRequest(err));
            }

            console.log('patch saved');
            cb(null, result);
          })
        });
    },
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

//var service = new MongooseService(serviceName,  model, { connection: mongoose });

module.exports = service;
