/* API routes */
module.exports = function(app) {

  var user = require('../controllers/user')(app);

  app.get('/users', checkToken, user.index);
  app.get('/users/:id', checkToken, user.show);
  app.post('/users', checkToken, user.insert);
  app.put('/users/:id', checkToken, user.update);
  app['delete']('/users/:id', checkToken, user['delete']);

};

var url = require('url')
  , querystring = require('querystring')
  , errorResults = require('../controllers/errors');

function checkToken(req, res, next) {

  var urlParsed = url.parse(req.url);
  var query = querystring.parse(urlParsed.query);

  if(typeof query.access_token === 'undefined') return errorResults['401'](res, 'Please get an access token');

  next();

}