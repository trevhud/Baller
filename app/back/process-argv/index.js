'use strict';

var yargs = require('yargs'),
    path = require('path'),
    config = require(path.join(process.requireRoot, 'config.json'));

module.exports = decorateArgv();

//////////

function decorateArgv() {
  return yargs.default(config.processArgv).argv;
}