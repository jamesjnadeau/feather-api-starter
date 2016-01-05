var notify = require('notifyUtil');
module.exports = function (dialog) {
  var image = {};
  function getContentToolsSize() {
    var tmp = [image.size.width, image.size.height];
    return tmp;

  }
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
    var putImage = function(signedRequest, successURL) {
      // Define functions to handle upload progress and completion
      var xhrProgress = function (ev) {
          // Set the progress for the upload
          dialog.progress((ev.loaded / ev.total) * 100);
      }
      var xhrComplete = function (ev) {
          var response;
          // Check the request is complete
          if (ev.target.readyState != 4) {
              return;
          }
          // Handle the result of the upload
          if (parseInt(ev.target.status) == 200) {
              dialog.populate(image.url, getContentToolsSize());
          } else {
              // The request failed, notify the user
              new ContentTools.FlashUI('no');
          }
      }

      // Make the request
      var xhr = new XMLHttpRequest();
      xhr.upload.addEventListener('progress', xhrProgress);
      xhr.addEventListener('readystatechange', xhrComplete);

      //xhr.open('POST', '/upload-image', true);
      xhr.open('PUT', signedRequest, true);
      //xhr.setRequestHeader('Content-Type', file.type);
      xhr.setRequestHeader('x-amz-acl', 'public-read');
      xhr.send(file);
    }

    var getPutURL = function() {
      var authURL = env.API_URL+'/auth/file/put';
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
          dialog.progress(1);
          image = $.extend({}, record, image);
          putImage(record.signedRequest, record.successURL);
        },
        error: function() {
          //console.log( "error", arguments );
          notify('Problem with the upload', 'maybe try again?', 'danger');
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
        image.size = {
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

  /*
  image rotation
  */
  function rotateImage(direction) {
    //TODO implement image rotating
    alert('Not supported yet, please rotate the image before uploading.');
    // Populate the dialog
    dialog.populate(image.url, getContentToolsSize());
  }

  dialog.bind('imageUploader.rotateCCW', function () {
      rotateImage('CCW');
  });

  dialog.bind('imageUploader.rotateCW', function () {
      rotateImage('CW');
  });

  /*
  Saving
  */
  dialog.bind('imageUploader.save', function () {
    var crop, cropRegion;

    // Set the dialog to busy while the rotate is performed
    dialog.busy(true);
    // Check if a crop region has been defined by the user
    cropRegion = dialog.cropRegion();
    //check if the regeion is not the default [0, 0, 1, 1]
    if (cropRegion[0] != 0 || cropRegion[1] != 0
      || cropRegion[2] != 1 || cropRegion[3] != 1) {
      alert('Cropping is not yet supported, please crop your image before uploading.');
      //TODO implement image cropping
    }
    //send a request back to the server signifying the image has been uploaded
    //and is now going to be used
    $.ajax({
      url: image.successURL,
      //Everything went great, populate the dialog box
      success: function(record) {
        // Free the dialog from its busy state
        dialog.busy(false);
        dialog.save(
          image.url,
          getContentToolsSize(),
          {
            //'alt': response.alt,
            'data-ce-max-width': image.size.width
          });
      },
      error: function() {
        // The request failed, notify the user
        new ContentTools.FlashUI('no');
      }
    });
  });
};
