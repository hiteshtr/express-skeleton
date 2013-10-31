/*!
 * Module dependencies.
 */

var async = require('async');

/**
 * Controllers
 */

var main = require('../app/controllers/main_controller');
var auth = require('./middlewares/authorization');

/**
 * Route middlewares
 */

var articleAuth = [auth.requiresLogin, auth.article.hasAuthorization];

/**
 * Expose routes
 */

module.exports = function (app) {

  // user routes example------------
  //app.get('/login', users.login);
  //app.get('/logout', users.logout);
  //app.post('/users', users.create);
  
  //loading user profile example
  //app.param('userId', users.user)

  // article routes
  //app.get('/articles', articles.index)
  //app.get('/articles/new', auth.requiresLogin, articles.new)
  //app.post('/articles', auth.requiresLogin, articles.create)
  //app.get('/articles/:id', articles.show)
  //app.get('/articles/:id/edit', articleAuth, articles.edit)
  //app.put('/articles/:id', articleAuth, articles.update)
  //app.del('/articles/:id', articleAuth, articles.destroy)

  //app.param('id', articles.load)

  // home route
  app.get('/', application.index);

}