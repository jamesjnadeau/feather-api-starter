var model = require('../models/user');
MongooseService = require('feathers-mongoose-advanced');
module.exports = new MongooseService(model);
