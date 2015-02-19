'use strict';

var gulp = require('gulp'),
    bump = require('gulp-bump'),
    argv = require('yargs').argv,
    chalk = require('chalk');

gulp.task('bump', function() {
  if (argv.type) {
    return gulp
      .src('./package.json')
      .pipe(bump({type: argv.type}))
      .pipe(gulp.dest('.'));
  } else if (argv.num) {
    return gulp
      .src('./package.json')
      .pipe(bump({version: argv.num}))
      .pipe(gulp.dest('.'));
  } else {
    console.log(chalk.red('bump error: --type or --num parameter required'));
  }
});