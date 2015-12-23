
var notify = require('notifyUtil');
var errorUtil = require ('errorUtil');
require('ContentTools/build/content-tools.js');
var imageUploader = require('./imageUploader')

 module.exports = function(feathers) {

  $(function() {

    //Set the content editor to use the stuff defined above
    window.ContentTools.IMAGE_UPLOADER = imageUploader;
    /*
     * Content Editor
     */
    editor = window.ContentTools.EditorApp.get();
    editor.init('*[data-editable]', 'data-name');
    editor.bind('save', function (regions, calledBy) {
      console.log(regions);
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
