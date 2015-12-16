var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
passportLocalMongoose = require('passport-local-mongoose');

// Set up the schema
var schema = new mongoose.Schema({
  title: {
    type: String,
  }
  updated_at: {
    type: Date,
    default: new Date(),
  },
  created_at: {
    type: Date,
    default: new Date(),
  }
});

schema.pre('save', function(next) {
  var that = this
  that.updated_at = _.isUndefined(that.created_at) ? that._id.getTimestamp() : new Date();
  if (!that.created_at)
    that.created_at = that._id.getTimestamp()
  next()
})

//Plugins
schema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Content', schema);
