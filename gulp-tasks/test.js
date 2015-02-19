'use strict';

var gulp = require('gulp'),
    path = require('path'),
    jasmine = require('gulp-jasmine'),
    runSequence = require('run-sequence'),
    config = require('./config.json');

gulp.task('test', function(cb) {
  // NOTE: run them in sequence for increased readability
  // (this is not a functional requirement)
  runSequence('test-front', 'test-back', cb);
});

gulp.task('test-front', function() {
  return gulp
    .src([
      path.join(config.common.paths.front.src,
        config.common.selectors.spec.file)
    ])
    .pipe(jasmine(config.test.common.jasmine));
});

gulp.task('test-back', function() {
  return gulp
    .src([
      path.join(config.common.paths.back.main, 
      config.common.selectors.spec.file)
    ])
    .pipe(jasmine(config.test.common.jasmine));
});