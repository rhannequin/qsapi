/* API routes */
module.exports = function(app) {

  var user = require('../controllers/user')(app)
    , weight = require('../controllers/weight')(app)
    , height = require('../controllers/height')(app)
    , location = require('../controllers/location')(app)
    , auth = require('../controllers/auth')(app)
    , url = require('url')
    , querystring = require('querystring')
    , errorResults = require('../utils/errors');

  // Auth
  app.post('/auth', auth.index);

  // User routes
  app.get('/users', checkToken, user.list);
  app.get('/users/:userId', checkToken, user.show);
  app.post('/users', user.insert);
  app.put('/users/:userId', checkToken, user.update);
  app['delete']('/users/:userId', checkToken, user['delete']);

  // Weight routes
  app.get('/users/:userId/weights', checkToken, weight.list);
  app.get('/users/:userId/weights/:weightId', checkToken, weight.show);
  app.post('/users/:userId/weights', checkToken, weight.insert);
  app['delete']('/users/:userId/weights/:weightId', checkToken, weight['delete']);

  // Height routes
  app.get('/users/:userId/heights', checkToken, height.list);
  app.get('/users/:userId/heights/:heightId', checkToken, height.show);
  app.post('/users/:userId/heights', checkToken, height.insert);
  app['delete']('/users/:userId/heights/:heightId', checkToken, height['delete']);

  // Location routes
  app.get('/users/:userId/locations', checkToken, location.list);
  app.get('/users/:userId/locations/:locationId', checkToken, location.show);
  app.post('/users/:userId/locations', checkToken, location.insert);
  app['delete']('/users/:userId/locations/:locationId', checkToken, location['delete']);

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
