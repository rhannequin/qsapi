// Require utils modules
var Util = require('../utils/util')
  , errorResults = require('../utils/errors')

// Define the exported module with app config as parameter
module.exports = function(app) {

    // Get database connection instance from app config
  var db = app.get('db')[0]
    // Get User model
    , User = require('../models/User')(db)
    // Create empty returned object
    , auth = {}

  // Our only method for authentication
  auth.index = function(req, res, next) {
    var body = req.body
    // Check if the POST object as the required parameters
    if(  typeof body === 'undefined'
      || typeof body.username === 'undefined'
      || typeof body.password === 'undefined'
    ) {
      // Return 400 Bad Request if the parameters are undefined
      return errorResults['400'](res, 'Missing parameters')
    }

    // Try to authenticate user from parameters
    User.findOne({
        username: body.username
      , password: body.password
    }, function (err, user) {
      Util.checkErrors(err, res, null, function() {
        // If the user is autenticated, return its information
        // Response contains access-token
        res.send(user)
      })
    })
  }

  // Return the module object
  return auth

}
