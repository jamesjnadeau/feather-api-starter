console.log('Start.');
require('bootstrap/dist/js/bootstrap.js');
var notify = require('notifyUtil');

var service = require('_local/assets/js/utils/serviceGetter')(window.API_URL);

var testService = service('content');

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

testService.count(function(count) {
  console.log(error, values);
  values.forEach(function(value) {
    notify('Content Count', JSON.stringify(count), 'success');
  })
});
