/*
 * Loads all routes and makes the app use them,
 * called after the initialzers in app.js
 */
var debug = require('debug')('api:routes');
var express = require('express');
var path = require('path');
var requireDirectory = require('require-directory');
var routes = requireDirectory(module);

module.exports = function(){
  var app = this;
  //console.log(routes);
  //console.log(routes);
  for (var route in routes) {
    //console.log(typeof route, route)
    switch(route) {
      case 'home':
        app.use('/', routes[route]);
        break;
      default:
        if(typeof routes[route] === 'function'
        || routes[route].hasOwnProperty('type')) {
          debug('using route', '/'+route);
          app.use('/'+route, routes[route]);
        } else {
          debug(route, ': Route is misconfigured, should return a function or an object with a type property:',
            'currently returns as a', typeof routes[route]);
        }
        break;
    }
  }

  //Static Routes
  app.use(express.static(path.join(__dirname, '../public')));
}
