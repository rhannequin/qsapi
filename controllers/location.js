var Util = require('../utils/util')

module.exports = function(app) {

  var db = app.get('db')[0]
    , Location = require('../models/Location')(db)
    , User = require('../models/User')(db)
    , routes = {}

  routes.list = function(req, res, next) {
    Location.findAll({}, function (err, locations) {
      Util.checkErrors(err, res, null, function() {
        res.send(locations)
      })
    })
  }

  routes.show = function(req, res, next) {
    Location.findOne({code: req.params.locationId}, function (err, location) {
      Util.checkErrors(err, res, null, function() {
        res.send(location)
      })
    })
  }

  routes.insert = function(req, res, next) {
    var dataToInsert = req.body
    dataToInsert.code = Util.generateCode()
    dataToInsert.created_at = new Date()
    User.findOne({code: req.params.userId}, function (err, user) {
      Util.checkErrors(err, res, null, function() {
        dataToInsert.author = {
            code : user.code
          , email : user.email
          , username : user.username
        }

        Location.create(dataToInsert, {}, function(err) {
          Util.checkErrors(err, res, null, function() {
            Location.findOne({ code: dataToInsert.code }, function (err, location) {
              Util.checkErrors(err, res, null, function() {
                res.status(201).send(location)
              })
            })
          })
        })
      })
    })
  }

  routes['delete'] = function(req, res, next) {
    Location.remove({ code: req.params.locationId }, function (err, result){
      Util.checkErrors(err, res, null, function() {
        res.status(200).send({ result: 'deleted' })
      })
    })
  }

  return routes

}
