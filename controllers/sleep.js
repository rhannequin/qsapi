// Require useful modules and utils
var async = require('async')
  , Util = require('../utils/util')
  , errorResults = require('../utils/errors')

module.exports = function(app) {
  // Init from app config
      // Database
  var db = app.get('db')[0]
      // Sleep model
    , Sleep = require('../models/Sleep')(db)
      // User model
    , User = require('../models/User')(db)
      // Returned object, init as empty
    , routes = {}

  // GET /users/:user/sleeps
  routes.list = function(req, res, next) {
    Sleep.findAll({}, function(err, sleeps) {
      // Render list of Sleep instances unless error is thrown
      Util.checkErrors(err, res, null, function() { res.send(sleeps) })
    })
  }

  // GET /users/:user/sleeps/:sleep
  routes.show = function(req, res, next) {
    Sleep.findOne({code: req.params.sleepId}, function(err, sleep) {
      // Render Sleep instance unless error is thrown
      Util.checkErrors(err, res, null, function() { res.send(sleep) })
    })
  }

  // POST /users/:user/sleeps
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
      // Create an instance of Sleep in db
      , _createSleep
      // Get the created Sleep's instance from db
      , _getSleep
    ], function(err, sleep) {
      // Return error through custom error handler's util module
      if(err) return errorResults['500'](res, err)
      // Otherwise, render the created Sleep instance
      return res.status(201).send(sleep)
    })
  }

  // DELETE /users/:user/sleeps/:sleep
  routes['delete'] = function(req, res, next) {
    Sleep.remove({code: req.params.sleepId}, function (err, result){
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

  function _createSleep(dataToInsert, cb) {
    Sleep.create(dataToInsert, {}, function(err) {
      if(err) return cb(err, dataToInsert)
      cb(null, dataToInsert.code)
    })
  }

  function _getSleep(code, cb) {
    Sleep.findOne({code: code}, function(err, sleep) {
      if(err) return cb(err)
      cb(null, sleep)
    })
  }


  // Return the filled route object
  return routes

}
