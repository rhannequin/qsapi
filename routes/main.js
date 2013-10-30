/* API routes */
module.exports = function(app) {

  var user = require('../controllers/user')(app)
    , weight = require('../controllers/weight')(app)
    , auth = require('../controllers/auth')(app)
    , url = require('url')
    , querystring = require('querystring')
    , errorResults = require('../controllers/errors');

  // Auth
  app.post('/auth', auth.index);

  // User routes
  app.get('/users', checkToken, user.list);
  app.get('/users/:userId', checkToken, user.show);
  app.post('/users', user.insert);
  app.put('/users/:userId', checkToken, user.update);
  app['delete']('/users/:id_user', checkToken, user['delete']);

  // Weight routes
  app.get('/users/:userId/weights', checkToken, weight.list);
  app.get('/users/:userId/weights/:weightId', checkToken, weight.show);
  app.post('/users/:userId/weights', checkToken, weight.insert);

  // Middlewares
  function checkToken(req, res, next) {

    var urlParsed = url.parse(req.url);
    var query = querystring.parse(urlParsed.query);

    if(typeof query.access_token === 'undefined') {
      return errorResults['401'](res, 'Please get an access token');
    }

    var db = app.get('db')[0];
    db.collection('users').findOne({access_token: query.access_token}, function(err, user){
      if(err) {
        return errorResults['500'](res, 'Error while trying to find access token');
      }
      if(user === null) {
        return errorResults['401'](res, 'Please get a valid access token');
      }
      next();
    });

  }

};
