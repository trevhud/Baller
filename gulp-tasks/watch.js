'use strict';

var gulp = require('gulp'),
    yargs = require('yargs'),
    config = require('./config.json'),
    runSequence = require('run-sequence');

gulp.task('watch', function() {

  var argv = getArgv(),
      tasks = [];

  (argv.images) ? tasks.push('watch-images') : null;
  (argv.stylesheets) ? tasks.push('watch-stylesheets') : null;
  (argv.templates) ? tasks.push('watch-templates') : null;
  (argv.html) ? tasks.push('watch-html') : null;
  (argv.front) ? tasks.push('watch-scripts') : null;
  (argv.back) ? tasks.push('watch-back') : null;

  return runSequence(tasks);
});

gulp.task('watch-images', function() {
  return gulp.watch(config.common.selectors.front.images,
    ['build-images']);
});

gulp.task('watch-stylesheets', function() {
  return gulp.watch(config.common.selectors.front.stylesheets.watch,
    { interval: 500 },
    ['build-stylesheets']);
});

gulp.task('watch-scripts', function() {

  var argv = getArgv(),
      tasks = [];

  (argv.frontLint && argv.lint) ? tasks.push('lint-front') : null;
  (argv.frontTest && argv.test) ? tasks.push('test-front') : null;
  (argv.buildScripts) ? tasks.push('build-scripts') : null;

  return gulp.watch(config.common.selectors.front.scripts,
    function() {
      runSequence.apply(this, tasks);
    });
});

gulp.task('watch-back', function() {

  var argv = getArgv(),
      tasks = [];

  (argv.backLint && argv.lint) ? tasks.push('lint-back') : null;
  (argv.backTest && argv.test) ? tasks.push('test-back') : null;
  (argv.serverRestart) ? tasks.push('server-forever-restart') : null;

  return gulp.watch(config.common.selectors.back.scripts,
    function() {
      runSequence.apply(this, tasks);
    });
});

gulp.task('watch-spec', function() {
  var argv = getArgv(),
      tasks = [];

  (argv.specLint) ? tasks.push('lint-spec') : null;
  (argv.test && argv.frontTest) ? tasks.push('test-front') : null;
  (argv.test && argv.backTest) ? tasks.push('test-back') : null;
});

gulp.task('watch-html', function() {
  return gulp.watch(config.common.selectors.front.html,
    ['build-html']);
});

gulp.task('watch-templates', function() {
  return gulp.watch(config.common.selectors.front.templates,
    function() {
      runSequence('build-templates', 'build-html');
    });
});

function getArgv() {
  return yargs.default(config.watch.argv).argv;
}