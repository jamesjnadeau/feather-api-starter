console.log('Start.');
require('bootstrap/dist/js/bootstrap.js');
var notify = require('notifyUtil');
var apiURL = window.API_URL;
var service = require('_local/assets/js/utils/serviceGetter')(window.API_URL);
var testService = service('content');

//Test if the api is accesible by getting the content count
testService.count({}, function(count) {
  //notify('Content Count', JSON.stringify(count), 'success');
  console.log('Content', JSON.stringify(count));
});

/*
 * Content Editor
 */
require('ContentTools/build/content-tools.js');
$(function() {
  editor = window.ContentTools.EditorApp.get();
  editor.init('*[data-editable]', 'data-name');
  editor.bind('save', function (regions, calledBy) {
    console.log(regions, calledBy);
  });
})
