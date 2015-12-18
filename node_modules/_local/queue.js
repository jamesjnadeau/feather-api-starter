var kue = require('kue')
var queue = kue.createQueue();

if(process.env.KUE_PORT) {
  kue.app.listen(process.env.KUE_PORT);
}
module.exports = queue;
