corser = require("corser");

module.exports = function() {
  var app = this;
  var test = process.env.ALLOWED_ORIGINS || 'http://localhost:8081';
  var apiUrl = process.env.API_URL || 'http://localhost:8080';
  var options = {
    origins: function(origin, callback) {
      //console.log(origin, origin == test, test);
      if(origin == test || origin == apiUrl) {
        callback(null, true);
      } else {
        console.warn('CORS DENIED THIS REQUEST: is your ALLOWED_ORIGINS environment variable set properly?');
        callback(null, false);
      }
    }
  };

  app.use(corser.create(options));
};
