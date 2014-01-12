/* API routes */
module.exports = function(app) {

    // Require Cotrollers
  var user         = require('../controllers/user')(app)
    , weight       = require('../controllers/weight')(app)
    , height       = require('../controllers/height')(app)
    , location     = require('../controllers/location')(app)
    , auth         = require('../controllers/auth')(app)

    // Require NodeJS modules
    , url          = require('url')
    , querystring  = require('querystring')

    // Require Util files
    , errorResults = require('../utils/errors')

  // Auth
  app.post('/auth', auth.index)

  // User routes
  app.get('/users', checkToken, user.list)
  app.get('/users/:userId', checkToken, user.show)
  app.post('/users', user.insert)
  app.put('/users/:userId', checkToken, user.update)
  app['delete']('/users/:userId', checkToken, user['delete'])

  // Weight routes
  app.get('/users/:userId/weights', checkToken, weight.list)
  app.get('/users/:userId/weights/:weightId', checkToken, weight.show)
  app.post('/users/:userId/weights', checkToken, weight.insert)
  app['delete']('/users/:userId/weights/:weightId', checkToken, weight['delete'])

  // Height routes
  app.get('/users/:userId/heights', checkToken, height.list)
  app.get('/users/:userId/heights/:heightId', checkToken, height.show)
  app.post('/users/:userId/heights', checkToken, height.insert)
  app['delete']('/users/:userId/heights/:heightId', checkToken, height['delete'])

  // Location routes
  app.get('/users/:userId/locations', checkToken, location.list)
  app.get('/users/:userId/locations/:locationId', checkToken, location.show)
  app.post('/users/:userId/locations', checkToken, location.insert)
  app['delete']('/users/:userId/locations/:locationId', checkToken, location['delete'])


  // Middlewares

  // Check if the param `access_token` is available
  // Check if the access_token param leads to a correct user
  //    if not, return an error 401 Unauthorized
  function checkToken(req, res, next) {
    // Get the URL as JavaScript object
    var urlParsed = url.parse(req.url)
    // Get the params as JavaScript object
    var query = querystring.parse(urlParsed.query)

    // Check if `access_token` is available
    if(typeof query.access_token === 'undefined') {
      return errorResults['401'](res, 'Please get an access token')
    }

    // Get from app config the database connection instance
    var db = app.get('db')[0]
    // Get the concerned User
    db.collection('users').findOne({access_token: query.access_token}, function(err, user){
      if(err) {
        return errorResults['500'](res, 'Error while trying to find access token')
      }
      if(user === null) {
        return errorResults['401'](res, 'Please get a valid access token')
      }
      // If the User is authenticated, allow the app to launch the controller
      next()
    })
  }

}
