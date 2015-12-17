var mongoose = require('mongoose');

var packageName = require('../../package').name;
var mongoURI = process.env.MONGO_URI || 'mongodb://localhost/'+packageName;

module.exports = function() {
  var app = this;
console.log(mongoURI);
  mongoose.connect(mongoURI);
  var connection = mongoose.connection;
  return connection;
}