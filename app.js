
/**
 * Module dependencies.
 */

var express = require('express');
//var routes = require('./routes');
//var user = require('./routes/user');
var http = require('http');
var path = require('path');
var fs = require('fs');
var helmet = require('helmet');
var MongoStore = require('connect-mongo')(express);

// database connection
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/mydb');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));

//helmet security
helmet.defaults(app);

app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session({
		secret: 'your secret here',
		store: new MongoStore({
			url: 'mongodb://localhost/mydb'
		})
	}));

//Cross-Site Request Forgery (CSRF) Protection
app.use(express.csrf());
app.use(function (req, res, next) {
res.locals.csrftoken = req.session._csrf;
next();
});

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// dynamically include routes (Controller)
fs.readdirSync('./controllers').forEach(function (file) {
  if(file.substr(-3) == '.js') {
      route = require('./controllers/' + file);
      route.controller(app);
  }
});

//app.get('/', routes.index);
//app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
