console.log('Start.');
require('bootstrap/dist/js/bootstrap.js');
var notify = require('notifyUtil');

var service = require('_local/assets/js/utils/serviceGetter')(env.API_URL);
var testService = service('content');

//Test if the api is accesible by getting the content count
testService.count({}, function(count) {
  //notify('Content Count', JSON.stringify(count), 'success');
  console.log('Content', JSON.stringify(count));
});

require('./contentTools/index.js')(service)
