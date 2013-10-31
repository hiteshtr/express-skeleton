var express = require('express');
var http = require('http');
var fs = require('fs');

/*
--Main application entry file
--Note:- order of loading is important
*/

//Load configurations
//if test env, load exapmle file
var env = process.env.NODE_ENV || 'development'
	, config = require('./config/config')[env]
	, mongoose = require('mongoose');

//Bootstrap db connection
mongoose.connect(config.db);

//Bootstrap models
var models_path = __dirname + '/app/models';
fs.readdirSync(models_path).forEach(function (file) {
	if (~file.indexOf('.js')) require(models_path  + '/' + file);
});

var app = express();
//express settings
require('./config/express')(app, config);

//Bootstrap routes
require('./config/routes')(app);

//Start the app by listening on <port>
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

exports = module.exports = app;