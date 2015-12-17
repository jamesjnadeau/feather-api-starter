var notify = require('notifyUtil');

module.exports = function(xhrProblem, callback) {
  if(xhrProblem) {
    var err = JSON.parse(xhrProblem.message);
    console.log(typeof err, err);
    notify('Problem Saving!', err.message, 'warning');
  } else {
    if(typeof callback === 'function') {
      callback();
    }
  }
}
