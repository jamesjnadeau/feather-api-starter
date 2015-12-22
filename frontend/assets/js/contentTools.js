
var notify = require('notifyUtil');
var errorUtil = require ('errorUtil');
require('ContentTools/build/content-tools.js');

 module.exports = function(feathers) {

  $(function() {
    var imageUploader = function (dialog) {
      console.log('imageUploader');
      var image={}, xhr, xhrComplete, xhrProgress;
      /*
      Event Handlers
      */
      //TODO review/test this one
      //cancelUpload -  user cancels their upload we abort the upload and set the dialog to an empty state
      dialog.bind('imageUploader.cancelUpload', function () {
          // Stop the upload
          if (xhr) {
              xhr.upload.removeEventListener('progress', xhrProgress);
              xhr.removeEventListener('readystatechange', xhrComplete);
              xhr.abort();
          }
          // Set the dialog to empty
          dialog.state('empty');
      });

      //clear - remove file from server
      //for now, rely on server auto process to do this
      dialog.bind('imageUploader.clear', function () {
          // Clear the current image
          dialog.clear();
          image = null;
      });

      //File Ready - file has been seletec, this uploads it and sizes it
      dialog.bind('imageUploader.fileReady', function (file) {
        // Set the dialog state to uploading and reset the progress bar to 0
        dialog.state('uploading');
        dialog.progress(0);

        //this is called after a putURL is recieved from the server
        //aka the url we will use to upload to s3
        var putImage = function(putURL) {
          console.log('putImage');
          // Upload a file to the server
          var formData;
          // Define functions to handle upload progress and completion
          xhrProgress = function (ev) {
              // Set the progress for the upload
              dialog.progress((ev.loaded / ev.total) * 100);
          }
          xhrComplete = function (ev) {
              var response;
              // Check the request is complete
              if (ev.target.readyState != 4) {
                  return;
              }
              // Clear the request
              xhr = null
              xhrProgress = null
              xhrComplete = null
              // Handle the result of the upload
              if (parseInt(ev.target.status) == 200) {
                  // Unpack the response (from JSON)
                  //response = JSON.parse(ev.target.responseText);
                  console.log(ev.target.responseText);
                  // Store the image details
                  //this is done in getPutURL and before via JS
                  /*image = {
                      size: response.size,
                      url: response.url
                      };
                  */
                  // Populate the dialog
                  dialog.populate(image.url, image.size);
              } else {
                  // The request failed, notify the user
                  new ContentTools.FlashUI('no');
              }
          }

          // Build the form data to post to the server
          formData = new FormData();
          formData.append('image', file);
          // Make the request
          xhr = new XMLHttpRequest();
          xhr.upload.addEventListener('progress', xhrProgress);
          xhr.addEventListener('readystatechange', xhrComplete);

          //xhr.open('POST', '/upload-image', true);
          xhr.open('PUT', putURL, true);
          //xhr.setRequestHeader('Content-Type', file.type);
          xhr.setRequestHeader('x-amz-acl', 'public-read');
          xhr.send(formData);
        }

        var getPutURL = function() {
          var authURL = env.API_URL+'/auth/file/put';
          console.log('getPutURL', authURL);
          //get a url to upload the file to
          $.ajax({
            url: authURL,
            method: "POST",
            data: {
              name: file.name,
              type: file.type,
              size: image.size,
            },
            success: function(record) {
              console.log('done', record);
              dialog.progress(1);
              image = $.extend({}, record, image);
              putImage(record.putURL);
            },
            error: function() {
              console.log( "error", arguments );
            }
          });
        }

        //Load/Read image sizes via JS
        var reader = new FileReader();
        var imageLoaded  = new Image();
        reader.readAsDataURL(file);
        reader.onload = function(_file) {
          imageLoaded.src = _file.target.result;
          imageLoaded.onload = function() {
            var size = {
              width: this.width,
              height: this.height,
              type: file.type,
              bytes: file.size,
            };
            image.name = file.name;
            getPutURL();
          };
          imageLoaded.onerror= function() {
              alert('Invalid file type: '+ file.type);
          };
        };
      });
    } //end imageUploader

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
