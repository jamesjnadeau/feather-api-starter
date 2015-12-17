console.log('Start.');
require('bootstrap/dist/js/bootstrap.js');
var notify = require('notifyUtil');

var feathers = require('feathers-client');

var app = feathers(window.API_URL)
  .configure(feathers.jquery());
var testService = app.service('content');

/* test create
testService.on('created', function(todo) {
  console.log('content created', todo);
});

testService.create({
  type: 'news',
  fields: { test: true }
}).then(function(todo) {
  console.log('Success!');
});
*/

testService.find(function(error, values) {
  console.log(error, values);
  values.forEach(function(value) {
    notify(value.type, JSON.stringify(value.fields), 'success');
  })
});
