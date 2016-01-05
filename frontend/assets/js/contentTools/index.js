
var notify = require('notifyUtil');
var errorUtil = require ('errorUtil');
require('ContentTools/build/content-tools.js');
//require('./contentToolsLoader');
var imageUploader = require('./imageUploader')
var contentPaste = require('./contentPaste');

 module.exports = function(feathers) {

  $(function() {


    //Set the content editor to use the stuff defined above
    window.ContentTools.IMAGE_UPLOADER = imageUploader;

    //define the editor we will use.
    editor = window.ContentTools.EditorApp.get();

    //monkey patch the paste functionality
    //see: https://github.com/GetmeUK/ContentTools/issues/7
    editor.paste = contentPaste

    //init editor on any elements
    editor.init('*[data-editable]', 'data-name');

    //bind save event to make call to api
    editor.bind('save', function (regions, calledBy) {
      this.busy(true);
      var id = window.CONTENT_ID;
      var type = window.CONTENT_TYPE;
      var service = feathers('content');
      var record = {
        fields: regions
      };
      service.patch(id, record, function(xhrProblem) {
        editor.busy(false);
          errorUtil(xhrProblem, function(err) {
            if(!err) {
              notify('Content Updated', 'Great work!', 'success');
            }
          });
        });
    });
  });
};
