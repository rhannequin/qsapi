module.exports = function(app) {


  // Get database
  var db = app.get('db')[0];

  var User = require('../models/User')(db);

  this.index = function(req, res, next) {
    var users = User.findAll(function (err, users) {
      if(err) {
        res.status(500).send({error: 'Internal Server Error'});
      }
      res.send(users);
    });
  };

  this.show = function(req, res, next) {
    var users = User.findOne({code: req.params.id}, function (err, user) {
      res.send(user);
    });
  };

  this.create = function(req, res, next) {
    // TODO
    res.send({});
  };

  this.update = function(req, res, next) {
    // TODO
    res.send({});
  };

  this.remove = function(req, res, next) {
    // TODO
    res.send({});
  };

  return this;

};
