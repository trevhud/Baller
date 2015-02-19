'use strict';

module.exports = loadRoutes;

////////////

var q = require('q'),
    requireDir = require('require-dir'),
    _ = require('lodash');

function loadRoutes(app) {
  var deferred = q.defer(),
      promises = [];

  _.forEach(requireDir(), function(routeLoader, fileName) {
    promises.push(q.when(routeLoader(app)));
  });

  q.all(promises).then(function() {
    deferred.resolve();
  });

  return deferred.promise;
}