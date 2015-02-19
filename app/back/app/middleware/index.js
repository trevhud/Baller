'use strict';

module.exports = loadMiddleware;

/////////
var path = require('path'),
    config = require(path.join(process.requireRoot, 'config.json')),
    argv = require(path.join(process.requireRoot, 'process-argv')),

    logger = require('morgan'),
    favicon = require('serve-favicon'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    methodOverride = require('method-override'),
    csurf = require('csurf'),
    compression = require('compression'),
    session = require('express-session');

function loadMiddleware(app) {

  // logger
  app.use(logger('dev'));

  if (process.env.NODE_ENV === 'development') {
    app.use(require('connect-livereload')());
  } else {
    // production
  }

  // favicon
  app.use(favicon(path.join(process.topLevel, config.common.paths.front,
    config.common.paths.favicon)));

  // cookie parser
  app.use(cookieParser(process.env.COOKIE_SECRET || 'cookie monster'));

  // body parser: urlencoded
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  // session management
  // adding a session store will enable the sessions to persist after
  // node restarts
  app.use(session({
    secret: process.env.SESSION_SECRET || 'shhhhhh',
    resave: false,
    rolling: true,
    cookie: {
      maxAge: 60 * 60 * 1000, // 1 hour
      httpOnly: true
    },
    saveUninitialized: true
    // store: ADD ME
  }));

  // passport
  // require('./passport.js')(app);

  // compression
  if (argv.compress) {
    app.use(compression());
  }

  // body parser: json
  app.use(bodyParser.json());

  // method override
  //
  // some clients are unable to make DELETE requests, etc.
  // Including an X-HTTP-Method-Override header will cause this app
  // to treat that request as a different method
  app.use(methodOverride());

  // do not reveal that this is an Express app
  app.disable('x-powered-by');

  // Cross site request forgery protection
  // note that we need to include req.csrfToken() in any form
  // submission as a result
  // e.g. <input type="hidden" name="_csrf" value="{{csrfToken}}">
  // or in POST/PUT/DEL/PATCH requests in one of the following:
  //
  // - in the body of the requests as req.body._csrf
  // - in the query string of the requests as as.query._csrf
  // - x-csrf-token and x-xsrf-token header fields
  //
  // GET, HEAD, OPTIONS do not need csrf tokens to be included
  //
  // requires that cookie or session based authentication is enabled
  app.use(csurf());

  // send the xsrfToken to the user
  // this must be sent back in POST/PUT/DELETE/PATCH requests
  // (see above)
  app.use(function(req, res, next) {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    next();
  });

  if (!argv.cache) {
    console.log('no cache');
    app.use(function(req, res, next) {
      res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
      next();
    });
  }

  if (!argv.minify) {
    // redirect .min.{js|css} to .{js|css}
    app.use(function(req, res, next) {
      req.url = req.url.replace(/\.min\.(js|css)$/,'.$1');
      next();
    });
  }

}