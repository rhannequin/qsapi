// Require useful modules and utils
var async = require('async')
  , Util = require('../utils/util')
  , errorResults = require('../utils/errors')

module.exports = function(app) {
  // Init from app config
  // Database
  var db = app.get('db')[0]
  // Sport model
    , Sport = require('../models/Sport')(db)
  // User model
    , User = require('../models/User')(db)
  // Returned object, init as empty
    , routes = {}

  // GET /users/:user/sports
  routes.list = function(req, res, next) {
    Sport.findAll({}, function(err, sports) {
      // Render list of Sport instances unless error is thrown
      Util.checkErrors(err, res, null, function() { res.send(sports) })
    })
  }

  // GET /users/:user/sports/:sport
  routes.show = function(req, res, next) {
    Sport.findOne({code: req.params.sportId}, function(err, sport) {
      // Render Sport instance unless error is thrown
      Util.checkErrors(err, res, null, function() { res.send(sport) })
    })
  }

  // POST /users/:user/sports
  routes.insert = function(req, res, next) {
    // Prepare the object to save into db
    var dataToInsert = req.body
    dataToInsert.code = Util.generateCode()
    dataToInsert.created_at = new Date()

    // Launch a async waterfall
    // each function is launched in series,
    // with parameters passed from the previous one
    async.waterfall([
      // Init waterfall
      function(callback) { callback(null, req.params.userId, dataToInsert) }
      // Get user instance from parameters
      , _getUser
      // Complete object to save with user's info
      , _fillData
      // Create an instance of Sport in db
      , _createSport
      // Get the created Sport's instance from db
      , _getSport
    ], function(err, sport) {
      // Return error through custom error handler's util module
      if(err) return errorResults['500'](res, err)
      // Otherwise, render the created Sport instance
      return res.status(201).send(sport)
    })
  }

  // DELETE /users/:user/sports/:sport
  routes['delete'] = function(req, res, next) {
    Sport.remove({code: req.params.sportId}, function (err, result){
      Util.checkErrors(err, res, null, function() {
        // Render success message unless error is thrown
        res.status(200).send({result: 'deleted'})
      })
    })
  }


  // Private methods

  function _getUser(code, dataToInsert, cb) {
    User.findOne({code: code}, function(err, user) {
      if(err) return cb(err)
      cb(null, user, dataToInsert)
    })
  }

  function _fillData(user, dataToInsert, cb){
    dataToInsert.author = {
      code : user.code
      , email : user.email
      , username : user.username }
    cb(null, dataToInsert)
  }

  function _createSport(dataToInsert, cb) {
    Sport.create(dataToInsert, {}, function(err) {
      if(err) return cb(err, dataToInsert)
      cb(null, dataToInsert.code)
    })
  }

  function _getSport(code, cb) {
    Sport.findOne({code: code}, function(err, sport) {
      if(err) return cb(err)
      cb(null, sport)
    })
  }


  // Return the filled route object
  return routes

}
