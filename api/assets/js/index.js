
require('bootstrap/dist/js/bootstrap.js');
require('jquery-ui');

var service = require('_local/assets/js/utils/serviceGetter')(window.location.origin);

require('./jsonEditor.js')(service);
require('./contentStarter.js')(service);
console.log("here");
