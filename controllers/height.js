var Util = require('../utils/util');

module.exports = function(app) {

  var db = app.get('db')[0]
    , Height = require('../models/Height')(db)
    , User = require('../models/User')(db)
    , routes = {};

  routes.list = function(req, res, next) {
    Height.findAll({}, function (err, heights) {
      Util.checkErrors(err, res, null, function() {
        res.send(heights);
      });
    });
  };

  routes.show = function(req, res, next) {
    Height.findOne({code: req.params.heightId}, function (err, height) {
      Util.checkErrors(err, res, null, function() {
        res.send(height);
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

        Height.create(dataToInsert, {}, function(err) {
          Util.checkErrors(err, res, null, function() {
            Height.findOne({code: dataToInsert.code}, function (err, height) {
              Util.checkErrors(err, res, null, function() {
                res.status(201).send(height);
              });
            });
          });
        });
      });
    });
  };

  return routes;

};
