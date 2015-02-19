'use strict';

module.exports = createApp;

//////////

var express = require('express'),
    q = require('q');

function createApp() {
  var deferred = q.defer(),
      app = express();

  q.when(require('./middleware')(app)).done(function() {
    q.when(require('./routes')(app)).done(function() {
      deferred.resolve(app);
    });
  });

  return deferred.promise;
}