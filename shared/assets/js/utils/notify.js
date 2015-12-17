var _ = require('lodash');
notify = require('bootstrap-notify');

//sets some sane defaults for bootstrap-notify so all you need to do is
//notify('OMG, look!', 'success', {url:'http://lookeyhere.com/', target:'_blank'});
module.exports = function(title, message, type, options, settings) {
  if(typeof type === 'undefined') {
    type = 'info';
  }
  var icon
  switch(type) {
    case 'success':
      icon = 'glyphicon glyphicons-ok';
      break;
    case 'info':
      icon = 'glyphicon glyphicons-info-sign';
      break;
    case 'warning':
      icon = 'glyphicon glyphicon-warning-sign';
      break;
    case 'danger':
      icon = 'glyphicon glyphicons-skull';
      break;
  }
  var _options = {
    // options
    icon: icon,
    title: title,
    message: message,
  };
  var _options = _.extend({}, _options, options);
  var settings = {
    // settings
    element: 'body',
    position: null,
    type: type,
    allow_dismiss: true,
    newest_on_top: false,
    showProgressbar: false,
    placement: {
      from: "top",
      align: "center"
    },
    offset: 60,
    spacing: 10,
    z_index: 1031,
    delay: 0, //If delay is set higher than 0 then the notification will auto-close after the delay period is up
    mouse_over: null,
    animate: {
      enter: 'animated fadeInDown',
      exit: 'animated fadeOutUp'
    },
    //Events
    onShow: null, //This event fires immediately when the show instance method is called.
    onShown: null,  //This event is fired when the modal has been made visible to the user (will wait for CSS transitions to complete).
    onClose: null,  //This event is fired immediately when the notification is closing.
    onClosed: null, //This event is fired when the modal has finished closing and is removed from the document (will wait for CSS transitions to complete).
    icon_type: 'class',
    template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0}" role="alert">' +
      '<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
      '<span data-notify="icon"></span> ' +
      '<b data-notify="title">{1}</b><br><br>' +
      '<span data-notify="message">{2}</span>' +
      '<div class="progress" data-notify="progressbar">' +
      	'<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
      '</div>' +
      '<a href="{3}" target="{4}" data-notify="url"></a>' +
    '</div>'
  };
  var _settings = _.extend({}, _settings, settings);

  $.notify(_options, _settings);
};
