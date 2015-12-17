var _ = require('lodash');
var mongoose = require('mongoose');

var schema = {
  schema: {
    name: {
      type: String,
      required: '{PATH} is required!',
    },
    urlPath: {
      type: String,
      required: '{PATH} is required!',
    },
    type: {
      type: String,
      default: 'User',
      enum: ['news'],
    },
    fields: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    updated_at: {
      type: Date,
      default: new Date(),
    },
    created_at: {
      type: Date,
      default: new Date(),
    },
  },
  pre:{
    save: [function(next) {
      var that = this;
      that.updated_at = _.isUndefined(that.created_at) ? that._id.getTimestamp() : new Date();
      if (!that.created_at)
        that.created_at = that._id.getTimestamp();
      next();
    }]
  },
  methods: {
  },
  statics: {
  },
  virtuals: {
  },
  indexes: [
  ],
  // Hooks
  before:{
    //all: [authHooks.requireAuth],
    //find: [authHooks.queryWithUserId],
    //get: [authHooks.queryWithUserId],
    // These will be executed in the order listed
    //create: [authHooks.setUserId, hooks.log],
    //update: [authHooks.setUserId],
    //patch: [authHooks.setUserId],
    //remove: [authHooks.setUserId]
  },
  after:{
    //all: [],
    //find: [hooks.log],
    //get: [],
    //create: [],
    //update: [],
    //patch: [],
    //remove: []
  }
};
module.exports = schema;
/*
schema.pre('save', function(next) {
  var that = this;
  that.updated_at = _.isUndefined(that.created_at) ? that._id.getTimestamp() : new Date();
  if (!that.created_at)
    that.created_at = that._id.getTimestamp();
  next();
})

module.exports = mongoose.model('Content', schema);
*/
