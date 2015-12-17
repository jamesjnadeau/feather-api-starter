var async = require('async');
var loaderUtil = require('loader-utils');
var pathUtil = require('path');
var jade = require('jade');

//ensure that mongo is connected using env variables
var mongoose = require('./utils/mongoose');
var contentSchema = require('./models/content');
var mongooseService = require('feathers-mongoose');
var contentService = mongooseService('content', contentSchema);

module.exports = function(source) {
  var self = this;
  //declare as cacheable
  self.cacheable();
  //declare as async and save function call for later
  var callback = self.async();
  var templatePath = __dirname+'/../frontend/views/content.jade';
  this.addDependency(templatePath);
  var template = jade.compileFile(templatePath, {pretty: false});

/*
  var connection = mongoose();
  connection.on('error', function(err) {
    console.error('mongo connection error: %s', err.message || err);
  });


  connection.on('open', function() {
    console.info('mongo connected');
  });
*/

  async.waterfall([
    function getContent(done) {
      contentService.find({}, done);
    },
    function processContent(results, done) {
      console.log('results', results);
      async.eachSeries(results, function(item, itemDone) {
        console.log(item);
        if(typeof item.urlPath !== 'undefined') {
          var outputFileName = pathUtil.join(item.urlPath, '/index.html')
            .replace(/^(\/|\\)/, ''); // Remove leading slashes for webpack-dev-server
          item.API_URL = process.env.API_URL || false;
          var content = template(item);
          self.emitFile(outputFileName, content);
        }
        itemDone();
      }, done);
    }
  ], function allDone(err) {
    if(err) console.log(err);
    console.log('Content Process Done')
    //when we are all done, disconnect mongoose
    //console.log('disconnecting mongoose');
    //connection.disconnect();
    callback(null, source);
  });


};
