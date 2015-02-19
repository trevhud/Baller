'use strict';

module.exports = createServer;

///////////

var path = require('path'),
    config = require(path.join(process.requireRoot, 'config.json')),
    http = require('http'),
    chalk = require('chalk');

function createServer(app) {
  var server = http.createServer(app),
      port = process.env.PORT || config.server.port;

  server.listen(port, function() {
    console.log(chalk.green('Server listening on port ' + port));
  });
}