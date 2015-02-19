'use strict';

var gulp = require('gulp'),
    dir2obj = require('dir2obj'),
    config = require('./config.json'),
    argv = require('yargs').argv,
    chalk = require('chalk'),
    fs = require('fs'),
    path = require('path'),
    cp = require('child_process');

gulp.task('init-dir', function(cb) {
  dir2obj.obj2dir(config.init.dir.dir2obj, '.').then(cb);
});

gulp.task('init-rename', function(cb) {
  var pkg, bower;

  if (argv.name) {
    // NOTE: there appear to be some inconsistencies with how require
    // and writeFileSync handle paths. require('../PATH') and
    // fs.readFileSync('PATH') refer to the same file, presumably
    // because init.js is one level in

    pkg = require('../package.json');
    pkg.name = argv.name;
    fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
    
    bower = require('../bower.json');
    bower.name = argv.name;
    fs.writeFileSync('bower.json', JSON.stringify(pkg, null, 2));
  } else {
    console.log(chalk.red('init-rename error: --name parameter required'));
  }
  cb();
});

gulp.task('init-heroku-buildpack', function() {
  cp.spawn('heroku', [
    'config:set',
    'BUILDPACK_URL=' + config.init.herokuBuildpack.buildpackUrl,
    'NODE_ENV=production'
  ]);
});