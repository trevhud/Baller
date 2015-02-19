'use strict';

var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    extend = require('node.extend'),
    config = require('./config.json');

gulp.task('lint', ['lint-back', 'lint-front', 'lint-spec']);

gulp.task('lint-back', function() {
  return gulp
    .src(config.common.selectors.back.scripts)
    .pipe(jshint(extend({}, config.lint.common, config.lint.node)))
    .pipe(jshint.reporter(stylish))
    .pipe(jshint.reporter('fail'));
});

gulp.task('lint-front', function() {
  return gulp
    .src(config.common.selectors.front.scripts)
    .pipe(jshint(extend({}, config.lint.common, config.lint.front)))
    .pipe(jshint.reporter(stylish))
    .pipe(jshint.reporter('fail'));
});

gulp.task('lint-spec', function() {
  return gulp
    .src(config.common.selectors.spec.all)
    .pipe(jshint(extend({}, config.lint.common, config.lint.spec)))
    .pipe(jshint.reporter(stylish))
    .pipe(jshint.reporter('fail'));
});