'use strict';

var path = require('path');

process.topLevel = path.join(__dirname, '..');
process.requireRoot = __dirname;

require('./app')().done(function(app) {
  require('./server')(app);
});

// add more modules here if necessary
// e.g.
// require('./scheduler')();