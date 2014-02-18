// Require useful modules and utils
var async = require('async')
  , Util = require('../utils/util')
  , errorResults = require('../utils/errors')

module.exports = function(app) {
  // Init from app config
      // Database
  var db = app.get('db')[0]
      // Cigarette model
    , Cigarette = require('../models/Cigarette')(db)
      // User model
    , User = require('../models/User')(db)
      // Returned object, init as empty
    , routes = {}

  // GET /users/:user/cigarettes
  routes.list = function(req, res, next) {
    Cigarette.findAll({}, function(err, cigarettes) {
      // Render list of Cigarette instances unless error is thrown
      Util.checkErrors(err, res, null, function() { res.send(cigarettes) })
    })
  }

  // GET /users/:user/cigarettes/:cigarette
  routes.show = function(req, res, next) {
    Cigarette.findOne({code: req.params.cigaretteId}, function(err, cigarette) {
      // Render Cigarette instance unless error is thrown
      Util.checkErrors(err, res, null, function() { res.send(cigarette) })
    })
  }

  // POST /users/:user/cigarettes
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
      // Create an instance of Cigarette in db
      , _createCigarette
      // Get the created Cigarette's instance from db
      , _getCigarette
    ], function(err, cigarette) {
      // Return error through custom error handler's util module
      if(err) return errorResults['500'](res, err)
      // Otherwise, render the created Cigarette instance
      return res.status(201).send(cigarette)
    })
  }

  // DELETE /users/:user/cigarettes/:cigarette
  routes['delete'] = function(req, res, next) {
    Cigarette.remove({code: req.params.cigaretteId}, function (err, result){
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

  function _createCigarette(dataToInsert, cb) {
    Cigarette.create(dataToInsert, {}, function(err) {
      if(err) return cb(err, dataToInsert)
      cb(null, dataToInsert.code)
    })
  }

  function _getCigarette(code, cb) {
    Cigarette.findOne({code: code}, function(err, cigarette) {
      if(err) return cb(err)
      cb(null, cigarette)
    })
  }


  // Return the filled route object
  return routes

}
