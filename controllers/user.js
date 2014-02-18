var Util = require('../utils/util')

module.exports = function(app) {

  var db = app.get('db')[0]
    , User = require('../models/User')(db)
    , routes = {}

  routes.list = function(req, res, next) {
    User.findAll({}, function (err, users) {
      Util.checkErrors(err, res, null, function() {
        res.send(users)
      })
    })
  }

  routes.show = function(req, res, next) {
    User.findOne({code: req.params.userId}, function (err, user) {
      Util.checkErrors(err, res, null, function() {
        res.send(user)
      })
    })
  }

  routes.insert = function(req, res, next) {
    // TODO : tests
    //if(typeof req.body === 'undefined') return errorResults['500'](res)
    var dataToInsert = req.body
    dataToInsert.code = Util.generateCode()
    dataToInsert.created_at = new Date()
    dataToInsert.access_token = Util.sha1(
      dataToInsert.code + dataToInsert.created_at,
      app.get('app-salt')
    )
    User.create(dataToInsert, {}, function(err){
      Util.checkErrors(err, res, null, function() {
        User.findOne({ code: dataToInsert.code }, function (err, user) {
          Util.checkErrors(err, res, null, function() {
            res.status(201).send(user)
          })
        })
      })
    })

  }

  routes.update = function(req, res, next) {
    // TODO : tests
    //if(typeof req.body === 'undefined') return errorResults['500'](res)
    User.edit({code: req.params.userId}, {$set:req.body}, {safe:true, multi:false}, function (err, result) {
      Util.checkErrors(err, res, null, function() {
        User.findOne({ code: req.params.userId }, function (err, user) {
          Util.checkErrors(err, res, null, function() {
          res.json(user)
          })
        })
      })
    })
  }

  routes['delete'] = function(req, res, next) {
    User.remove({ code: req.params.userId }, function (err, result){
      Util.checkErrors(err, res, null, function() {
        res.send({ result: 'deleted' })
      })
    })
  }

  return routes

}
