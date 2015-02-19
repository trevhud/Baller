'use strict';

var gulp = require('gulp'),
    pkg = require('../package.json'),
    argv = require('yargs').argv,
    foreverMonitor = require('forever-monitor'),
    childForever,
    chalk = require('chalk'),
    connect = require('gulp-connect'),
    path = require('path'),
    config = require('./config.json');

gulp.task('server', function() {
  require(path.join('..', config.common.paths.back.main));
});

gulp.task('server-forever', function() {
  if (childForever) {
    childForever.stop();
  }

  childForever = new (foreverMonitor.Monitor)('app/back/index.js', {
    args: process.argv.slice(2)
  });
  childForever.start();

  childForever.on('restart', function() {
    console.log(chalk.cyan('Server restarted'));
  });

  childForever.on('exit:code', function(code) {
    if (code) {
      console.log(chalk.red('Server exited with code ' + code));
    } else {
      console.log(chalk.cyan('Server exited'));
    }
  });
});

gulp.task('server-forever-restart', function() {
  childForever ? childForever.restart() : null;
});