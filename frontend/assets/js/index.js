console.log('Start.');
require('bootstrap/dist/js/bootstrap.js');
var notify = require('notifyUtil');
var url = window.API_URL;
console.log(url)
var service = require('_local/assets/js/utils/serviceGetter')(url);

var testService = service('content');

testService.count({}, function(count) {
  notify('Content Count', JSON.stringify(count), 'success');
  console.log('test 4');
});

console.log('End');
