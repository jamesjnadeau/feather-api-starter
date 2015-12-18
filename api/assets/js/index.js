
require('bootstrap/dist/js/bootstrap.js');
require('jquery-ui');

var service = require('_local/assets/js/utils/serviceGetter')(window.location.origin);

require('./json-editor.js')(service);
