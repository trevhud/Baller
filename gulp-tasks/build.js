'use strict';

var gulp = require('gulp'),
    pkg = require('../package.json'),
    config = require('./config.json'),
    fs = require('fs'),
    path = require('path'),
    rimraf = require('rimraf'),
    mainBowerFiles = require('main-bower-files'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    less = require('gulp-less'),
    minifyCSS = require('gulp-minify-css'),
    jade = require('gulp-jade'),
    runSequence = require('run-sequence'),
    wrapper = require('gulp-wrapper'),
    addSrc = require('gulp-add-src'),
    order = require('gulp-order'),
    reload = require('./live-reload.js');

// what follows 'heroku:' must match the value of NODE_ENV set on heroku
gulp.task('heroku:production', ['build']);

gulp.task('build', function(cb) {
  runSequence(
    'build-clean',
    ['build-scripts', 'build-stylesheets', 'build-templates', 'build-images', 'build-html'],
    cb
  );
});

gulp.task('build-images', function() {
  return gulp
    .src(config.common.selectors.front.images)
    .pipe(gulp.dest(config.common.paths.front.public))
    .pipe(reload());
});

gulp.task('build-scripts', function() {
  

  return gulp
    .src(getMatchingFiles(/.js$/))
    // "tag" the node_modules with different suffixes so that order
    // can place them in front
    .pipe(rename({ extname: '.vendor.js' }))
    .pipe(addSrc(config.common.selectors.front.scripts))
    // replace('.vendor.js', '.js') because of course, those aren't the real
    // suffixes
    .pipe(wrapper({
      header: function(file) {
        var fileName = file.path.replace('.vendor.js','.js');
        return '\n// Begin file: ' + fileName + '\n;(function() {\n';
      },
      footer: function(file) {
        var fileName = file.path.replace('.vendor.js','.js');
        return '\n})();\n// End file: ' + fileName + '\n';
      }
    }))
    .pipe(order(config.build.scripts.order))
    .pipe(concat(pkg.name + '.js'))
    .pipe(gulp.dest(config.common.paths.front.public))
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest(config.common.paths.front.public))
    .pipe(reload());
});

gulp.task('build-stylesheets', function() {
  var vendorStylesheets = getMatchingFiles(/.less$/);

  // non-minified
  gulp
    .src(vendorStylesheets)
    .pipe(addSrc(config.common.selectors.front.stylesheets))
    .pipe(less())
    // .pipe(addSrc(config.build.stylesheets.bower))
    // .pipe(gulp.dest(config.common.paths.front.public))
    .pipe(concat(pkg.name + '.css'))
    .pipe(gulp.dest(config.common.paths.front.public));

  // minified
  return gulp
    .src(vendorStylesheets)
    .pipe(addSrc(config.common.selectors.front.stylesheets))
    .pipe(less())
    .pipe(minifyCSS())
    .pipe(rename({ extname: '.min.css' }))
    // .pipe(gulp.dest(config.common.paths.front.public))
    .pipe(concat(pkg.name + '.min.css'))
    .pipe(gulp.dest(config.common.paths.front.public))
    .pipe(reload());

});

gulp.task('build-html', ['build-templates'], function() {
  var templates = '';

  // if templates is not available (i.e. because there are no .template.jade files)
  // this task should not fail
  try {
    templates = fs.readFileSync(
      path.join(config.common.paths.front.public, pkg.name + '.templates.html')
    );
  } catch(e) {

  }

  return gulp
    .src(config.common.selectors.front.views)
    .pipe(jade({
      pretty: true,
      locals: {
        templates: templates,
        pkg: pkg,
        config: config
      }
    }))
    .pipe(gulp.dest(config.common.paths.front.public))
    .pipe(reload());

});

gulp.task('build-templates', function() {
  return gulp
    .src(config.common.selectors.front.templates)
    .pipe(jade({
      pretty: true,
      locals: {
        pkg: pkg,
        config: config
      }
    }))
    .pipe(wrapper(config.build.template.wrapper))
    .pipe(concat(pkg.name + '.templates.html'))
    .pipe(gulp.dest(config.common.paths.front.public));
});

gulp.task('build-clean', function(cb) {
  rimraf(config.common.paths.front.public, cb);
});

function getMatchingFiles(re) {
  var bowerMain = mainBowerFiles(config.build.scripts.mainBowerFiles),
      matchingFiles = [];

  function ifMatchingPush(str) {
    re.exec(str) ? matchingFiles.push(str) : null;
  }

  bowerMain.forEach(function(main) {
    if (typeof main === 'string') {
      ifMatchingPush(main);
    } else if (main.constructor === Array) {
      main.forEach(ifMatchingPush);
    }
  });

  return matchingFiles;
}