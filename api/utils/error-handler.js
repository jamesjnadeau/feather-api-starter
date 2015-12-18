Error.stackTraceLimit = Infinity;
module.exports = function() {
  var app = this;

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // error handlers
  app.use(function(err, req, res, next) {
    if(req.xhr) {
      if (app.get('env') === 'development') {
        var send = {message: err.message, error: err };
        res.status(err.status || 500).json(send);
      } else {
        res.status(err.status || 500).json({message: err.message, error: {} });
      }
    } else {
      res.status(err.status || 500);
      if (app.get('env') === 'development') {
        // development error handler
        res.render('error', {
          message: err.message,
          error: err // will print stacktrace
        });
      } else {
        // production error handler
        res.render('error', {
          message: err.message,
          error: {} // no stacktraces leaked to user
        });
      }
    }
  });
};
