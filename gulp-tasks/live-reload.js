'use strict';

var gulp = require('gulp'),
    path = require('path'),
    through2 = require('through2'),
    tinyLr = require('tiny-lr'),
    lr,
    config = require('./config.json');

// because it (seems) impossible to pass parameters to gulp tasks,
// and we need to pass a list of files so that the client-side live-reload
// script knows which files to reload, we need to trigger server reloads
// by calling a function directly.
//
// reload is achieved through a bespoke transform stream that, on "end",
// triggers a reload and otherwise passes files through.
module.exports = reload;

gulp.task('live-reload-start', function() {
  lr = tinyLr();
  lr.listen(config.liveReload.lr.port);
});

/////////////////////

function reload() {
  var files = [],
      pipe = through2.obj(function(file, encoding, done) {
        files.push(file.path);
        this.push(file);

        done();
      });

  pipe.on('end', function() {
    if (process.env.NODE_ENV === 'development') {
      var basePublicDir = path.join(__dirname, '..', config.common.paths.front.public);
      reloadServer(files.map(function(file) { 
        return path.join(config.locals.publicPath, file.replace(basePublicDir, ''));
      }));
    }
  });

  return pipe;
}

function reloadServer(files) {
  if (lr) {
    lr.changed({
      body: {
        files: files
      }
    });
  }
}