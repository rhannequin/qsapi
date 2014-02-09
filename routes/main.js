/* API routes */
module.exports = function(app) {

    // Require Controllers
  var user         = require('../controllers/user')(app)
    , weight       = require('../controllers/weight')(app)
    , height       = require('../controllers/height')(app)
    , location     = require('../controllers/location')(app)
    , sleep        = require('../controllers/sleep')(app)
    , auth         = require('../controllers/auth')(app)
    // Require NodeJS modules
    , url          = require('url')
    , querystring  = require('querystring')
    // Require Util files
    , errorResults = require('../utils/errors')
    // Get dv connection instance from app params
    , db = app.get('db')[0]
    // Require Models
    , User         = require('../models/User')(db)


  // Auth
  app.post('/auth', auth.index)

  // User routes
  app.get('/users/:userId', checkToken, filterByOwner, user.show)
  app.post('/users', user.insert)
  app.put('/users/:userId', checkToken, filterByOwner, user.update)
  app['delete']('/users/:userId', checkToken, filterByOwner, user['delete'])

  // Weight routes
  app.get('/users/:userId/weights', checkToken, filterByOwner, weight.list)
  app.get('/users/:userId/weights/:weightId', checkToken, filterByOwner, weight.show)
  app.post('/users/:userId/weights', checkToken, filterByOwner, weight.insert)
  app['delete']('/users/:userId/weights/:weightId', checkToken, filterByOwner, weight['delete'])

  // Height routes
  app.get('/users/:userId/heights', checkToken, filterByOwner, height.list)
  app.get('/users/:userId/heights/:heightId', checkToken, filterByOwner, height.show)
  app.post('/users/:userId/heights', checkToken, filterByOwner, height.insert)
  app['delete']('/users/:userId/heights/:heightId', checkToken, filterByOwner, height['delete'])

  // Location routes
  app.get('/users/:userId/locations', checkToken, filterByOwner, location.list)
  app.get('/users/:userId/locations/:locationId', checkToken, filterByOwner, location.show)
  app.post('/users/:userId/locations', checkToken, filterByOwner, location.insert)
  app['delete']('/users/:userId/locations/:locationId', checkToken, filterByOwner, location['delete'])

  // Sleep routes
  app.get('/users/:userId/sleeps', checkToken, filterByOwner, sleep.list)
  app.get('/users/:userId/sleeps/:sleepId', checkToken, filterByOwner, sleep.show)
  app.post('/users/:userId/sleeps', checkToken, filterByOwner, sleep.insert)
  app['delete']('/users/:userId/sleeps/:sleepId', checkToken, filterByOwner, sleep['delete'])


  // Middlewares

  // Check if the param `access_token` is available
  // Check if the access_token param leads to a correct user
  //    if not, return an error 401 Unauthorized
  function checkToken(req, res, next) {
    var access_token = parseAccessToken(req)

    // Check if `access_token` is available
    if(typeof access_token === 'undefined') {
      return errorResults['401'](res, 'Please get an access token')
    }

    // Get the concerned User
    User.findOne({access_token: access_token}, function (err, user) {
      if(err) return errorResults['401'](res, 'Please get a valid access token')
      next()
    })
  }


  // Allow only authenticated user to access to his own information
  function filterByOwner(req, res, next) {
    var access_token = parseAccessToken(req)

    // Get the concerned User
    User.findOne({
        access_token: access_token
      , code: req.params.userId
    }, function (err, user) {
      if(err || user === null) {
        return errorResults['401'](res, "You're not allewed to access this ressource")
      }
      // If the User is the owner, allow the app to launch the controller
      next()
    })
  }


  // Private methods

  // Return access_token from URL
  function parseAccessToken(req) {
    // Get the URL as JavaScript object
    var urlParsed = url.parse(req.url)
    // Return the params as JavaScript object
    return querystring.parse(urlParsed.query).access_token
  }

}
