//Module Dependency

var express = require('express');
var http = require('http');
var path = require('path');
//var fs = require('fs');
var helmet = require('helmet');
var MongoStore = require('connect-mongo')(express);
var flash = require('connect-flash');
var helpers = require('view-helpers');
var pkg = require('../package.json');

module.exports = function (app, config) {

	app.set('showStackedError', true);

	//for compression of all response
	app.use(express.compress({
		filter: function (req, res) {
			return /json|text|javascript|css/.test(res.getHeader('Content-Type'));
		},
		level: 9
	}));

	// all environments
	app.set('port', process.env.PORT || 3000);
	app.use(express.favicon());

	//setting view path and template engine
	app.set('views', path.join(__dirname, '/app/views'));
	app.set('view engine', 'jade');

	//don't use logger for test env
	if (process.env.NODE_ENV !== 'test') {
		app.use(express.logger('dev'));
	};

	app.configure(function () {
		//expose package.json to views
		app.use(function (req, res, next) {
			res.locals.pkg = pkg;
			next();
		});
	});

	//sessions and cookieParser
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser('your secret here'));
	app.use(express.session({
			secret: 'your secret here',
			store: new MongoStore({
				url: config.db,
				collection: 'sessions'
			})
		}));

	//connect flash for flash messages - should be declared after sessions
	app.use(flash());

	//should be declared after sessions and flash
	app.use(helpers(pkg.name));

	//Cross-Site Request Forgery (CSRF) Protection
	app.use(express.csrf());
	app.use(function (req, res, next) {
		res.locals.csrftoken = req.csrfToken();
		next();
	});

	// routes should be at the last
    app.use(app.router);

    // assume "not found" in the error msgs
    // is a 404. this is somewhat silly, but
    // valid, you can do whatever you like, set
    // properties, use instanceof etc.
    app.use(function(err, req, res, next){
      // treat as 404
      if (err.message
        && (~err.message.indexOf('not found')
        || (~err.message.indexOf('Cast to ObjectId failed')))) {
        return next()
      }

      // log it
      // send emails if you want
      console.error(err.stack)

      // error page
      res.status(500).render('500', { error: err.stack })
    });

    // assume 404 since no middleware responded
    app.use(function(req, res, next){
      res.status(404).render('404', {
        url: req.originalUrl,
        error: 'Not found'
      })
    });

  // development env config
  app.configure('development', function () {
    app.locals.pretty = true
  });
}