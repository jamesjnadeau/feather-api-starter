
require('bootstrap/dist/js/bootstrap.js');
require('jquery-ui');


var feathers = require('feathers-client');

var quil = feathers(location.origin)
  .configure(feathers.jquery());

require('./json-editor.js')(quil);
