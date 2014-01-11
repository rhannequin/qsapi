var Util = require('../utils/util')
  , async = require('async')

module.exports = function(app) {

  var db = app.get('db')[0]
    , Weight = require('../models/Weight')(db)
    , User = require('../models/User')(db)
    , routes = {}

  routes.list = function(req, res, next) {
    Weight.findAll({}, function(err, weights) {
      Util.checkErrors(err, res, null, function() {
        res.send(weights)
      })
    })
  }

  routes.show = function(req, res, next) {
    Weight.findOne({code: req.params.weightId}, function(err, weight) {
      Util.checkErrors(err, res, null, function() {
        res.send(weight)
      })
    })
  }

  routes.insert = function(req, res, next) {
    var dataToInsert = req.body
    dataToInsert.code = Util.generateCode()
    dataToInsert.created_at = new Date()

    async.waterfall([
        _initIsert
      , _getUser
      , _fillData
      , _createWeight
      , _getWeight
    ], function(err, weight) {
      if(err) return res.status(500).send({error: err})
      return res.status(201).send(weight)
    })
  }

  routes['delete'] = function(req, res, next) {
    Weight.remove({code: req.params.weightId}, function (err, result){
      Util.checkErrors(err, res, null, function() {
        res.status(200).send({result: 'deleted'})
      })
    })
  }


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
    Weight.findOne({code: code}, function(err, weight) {
      if(err) return cb(err)
      cb(null, weight)
    })
  }


  return routes

}
