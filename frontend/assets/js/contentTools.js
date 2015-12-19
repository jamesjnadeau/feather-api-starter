
var notify = require('notifyUtil');
var errorUtil = require ('errorUtil');
require('ContentTools/build/content-tools.js');

 module.exports = function(feathers) {

   $(function() {
    /*
     * Content Editor
     */
     editor = window.ContentTools.EditorApp.get();
     editor.init('*[data-editable]', 'data-name');
     editor.bind('save', function (regions, calledBy) {
       console.log(regions, calledBy);
       var id = window.CONTENT_ID;
       var type = window.CONTENT_TYPE;
       var service = feathers('content');
       var record = {
         fields: regions
       };
       service.patch(id, record, function(xhrProblem) {
         errorUtil(xhrProblem, function(err) {
           if(!err) {
             notify('Content Updated',
               'Great work!', 'success');
             //refresh currently loaded ids - deals with new record not showing
             self.loadIds();
           }
         });
       });

     });
   })
 }
