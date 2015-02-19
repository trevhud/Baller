'use strict';

module.exports = bindFrontEndRoutes;

////////////

var q = require('q'),
    path = require('path'),
    config = require(path.join(process.requireRoot, 'config.json')),
    serveStatic = require('serve-static'),
    frontPath = path.resolve(path.join(process.topLevel, config.common.paths.front)),
    angularPath = path.resolve(path.join(frontPath, 'index.html'));

function bindFrontEndRoutes(app) {
  app.use(config.app.routes.frontEnd.static.route,
    serveStatic(frontPath, config.app.routes.frontEnd.static.config
  ));

  loadAngularRoutes(app, config.app.routes.frontEnd.angularPaths);
}

function loadAngularRoutes(app, routes) {
  routes.forEach(function(route) {
    app.get(route, function(req, res) {
      res.sendFile(angularPath);
    });
  });
}

// app.get('/surveys/:id/', surveyController.getSurvey);
