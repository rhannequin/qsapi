// Require useful modules and utils
var async = require('async')
  , Util = require('../utils/util')
  , errorResults = require('../utils/errors')

module.exports = function(app) {
  // Init from app config
      // Database
  var db = app.get('db')[0]
      // Drink model
    , Drink = require('../models/Drink')(db)
      // User model
    , User = require('../models/User')(db)
      // Returned object, init as empty
    , routes = {}

  // GET /users/:user/drinks
  routes.list = function(req, res, next) {
    Drink.findAll({}, function(err, drinks) {
      // Render list of Drink instances unless error is thrown
      Util.checkErrors(err, res, null, function() { res.send(drinks) })
    })
  }

  // GET /users/:user/drinks/:drink
  routes.show = function(req, res, next) {
    Drink.findOne({code: req.params.drinkId}, function(err, drink) {
      // Render Drink instance unless error is thrown
      Util.checkErrors(err, res, null, function() { res.send(drink) })
    })
  }

  // POST /users/:user/drinks
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
      // Create an instance of Drink in db
      , _createDrink
      // Get the created Drink's instance from db
      , _getDrink
    ], function(err, drink) {
      // Return error through custom error handler's util module
      if(err) return errorResults['500'](res, err)
      // Otherwise, render the created Drink instance
      return res.status(201).send(drink)
    })
  }

  // DELETE /users/:user/drinks/:drink
  routes['delete'] = function(req, res, next) {
    Drink.remove({code: req.params.drinkId}, function (err, result){
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

  function _createDrink(dataToInsert, cb) {
    Drink.create(dataToInsert, {}, function(err) {
      if(err) return cb(err, dataToInsert)
      cb(null, dataToInsert.code)
    })
  }

  function _getDrink(code, cb) {
    Drink.findOne({code: code}, function(err, drink) {
      if(err) return cb(err)
      cb(null, drink)
    })
  }


  // Return the filled route object
  return routes

}
