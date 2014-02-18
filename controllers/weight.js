// Require useful modules and utils
var async = require('async')
  , Util = require('../utils/util')
  , errorResults = require('../utils/errors')

module.exports = function(app) {
  // Init from app config
      // Database
  var db = app.get('db')[0]
      // Weight model
    , Weight = require('../models/Weight')(db)
      // User model
    , User = require('../models/User')(db)
      // Returned object, init as empty
    , routes = {}

  // GET /users/:user/weights
  routes.list = function(req, res, next) {
    Weight.findAll({}, function(err, weights) {
      // Render list of Weight instances unless error is thrown
      Util.checkErrors(err, res, null, function() { res.send(weights) })
    })
  }

  // GET /users/:user/weights/:weight
  routes.show = function(req, res, next) {
    Weight.findOne({code: req.params.weightId}, function(err, weight) {
      // Render Weight instance unless error is thrown
      Util.checkErrors(err, res, null, function() { res.send(weight) })
    })
  }

  // POST /users/:user/weights
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
      // Create an instance of Weight in db
      , _createWeight
      // Get the created Weight's instance from db
      , _getWeight
    ], function(err, weight) {
      // Return error through custom error handler's util module
      if(err) return errorResults['500'](res, err)
      // Otherwise, render the created Weight instance
      return res.status(201).send(weight)
    })
  }

  // DELETE /users/:user/weights/:weight
  routes['delete'] = function(req, res, next) {
    Weight.remove({ code: req.params.weightId }, function (err, result){
      Util.checkErrors(err, res, null, function() {
        // Render success message unless error is thrown
        res.status(200).send({ result: 'deleted' })
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

  function _createWeight(dataToInsert, cb) {
    Weight.create(dataToInsert, {}, function(err) {
      if(err) return cb(err, dataToInsert)
      cb(null, dataToInsert.code)
    })
  }

  function _getWeight(code, cb) {
    Weight.findOne({ code: code }, function(err, weight) {
      if(err) return cb(err)
      cb(null, weight)
    })
  }


  // Return the filled route object
  return routes

}
