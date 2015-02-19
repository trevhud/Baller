'use strict';

var requireDir = require('require-dir'),
    dir = requireDir('./gulp-tasks'),
    gulp = require('gulp'),
    yargs = require('yargs'),
    config = require('./gulp-tasks/config.json'),
    runSequence = require('run-sequence');

gulp.task('default', function() {
  var argv = getArgv(),
      tasks = [];

  (argv.lint) ? tasks.push('lint') : null;
  (argv.test) ? tasks.push('test') : null;
  (argv.build) ? tasks.push('build') : null;
  (argv.watch) ? tasks.push('watch') : null;
  (argv.server) ? tasks.push('server-forever') : null;
  (argv.liveReload) ? tasks.push('live-reload-start') : null;

  runSequence.apply(this, tasks);

});

function getArgv() {
  return yargs.default(config.default.argv).argv;
}