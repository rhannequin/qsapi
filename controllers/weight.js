var Util = require('../utils/util');

module.exports = function(app) {

  var db = app.get('db')[0]
    , Weight = require('../models/Weight')(db)
    , User = require('../models/User')(db)
    , routes = {};

  routes.list = function(req, res, next) {
    Weight.findAll({}, function (err, weights) {
      Util.checkErrors(err, res, null, function() {
        res.send(weights);
      });
    });
  };

  routes.show = function(req, res, next) {
    Weight.findOne({code: req.params.weightId}, function (err, weight) {
      Util.checkErrors(err, res, null, function() {
        res.send(weight);
      });
    });
  };

  routes.insert = function(req, res, next) {
    var dataToInsert = req.body;
    dataToInsert.code = Util.generateCode();
    dataToInsert.created_at = new Date();
    User.findOne({code: req.params.userId}, function (err, user) {
      Util.checkErrors(err, res, null, function() {
        dataToInsert.author = {
          code : user.code,
          email : user.email,
          username : user.username
        };

        Weight.create(dataToInsert, {}, function(err) {
          Util.checkErrors(err, res, null, function() {
            Weight.findOne({code: dataToInsert.code}, function (err, weight) {
              Util.checkErrors(err, res, null, function() {
                res.status(201).send(weight);
              });
            });
          });
        });
      });
    });
  };

  routes['delete'] = function(req, res, next) {
    Weight.remove({code: req.params.weightId}, function (err, result){
      Util.checkErrors(err, res, null, function() {
        res.status(200).send({result: 'deleted'});
      });
    });
  };

  return routes;

};
