/* API routes */
module.exports = function(app) {

  var user = require('../controllers/user')(app)
    , url = require('url')
    , querystring = require('querystring')
    , errorResults = require('../controllers/errors');


  // User routes
  app.get('/users', checkToken, user.index);
  app.get('/users/:id', checkToken, user.show);
  app.post('/users', user.insert);
  app.put('/users/:id', checkToken, user.update);
  app['delete']('/users/:id', checkToken, user['delete']);

  // Middlewares
  function checkToken(req, res, next) {

    var urlParsed = url.parse(req.url);
    var query = querystring.parse(urlParsed.query);

    if(typeof query.access_token === 'undefined') return errorResults['401'](res, 'Please get an access token');

    var db = app.get('db')[0];
    db.collection('users').findOne({access_token: query.access_token}, function(err, user){
      if(err) return errorResults['500'](res, 'Error while trying to find access token');
      if(user === null){
        return errorResults['404'](res, 'Unknown access token');
      } else {
        next();
      }
    });

  }

};
