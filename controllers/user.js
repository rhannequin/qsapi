module.exports = function(app) {

  // Get database
  var db = app.get('db')[0];

  var User = require('../models/User')(db);

  var errorResults = require('./errors');

  this.index = function(req, res, next) {
    User.findAll(function (err, users) {
      if(err) return errorResults['500'](res);
      res.send(users);
    });
  };

  this.show = function(req, res, next) {
    User.findOne({code: req.params.id}, function (err, user) {
      if(err) return errorResults['500'](res);
      res.send(user);
    });
  };

  this.create = function(req, res, next) {
    // TODO
    res.send({});
  };

  this.update = function(req, res, next) {
    User.edit({code: req.params.id}, {$set:req.body}, {safe:true, multi:false}, function (err, result) {
      if(err) return errorResults['500'](res);
      User.findOne({code: req.params.id}, function (err, user) {
        if(err) return errorResults['500'](res);
        res.send(user);
      });
    });
  };

  this['delete'] = function(req, res, next) {
    User.remove({code: req.params.id}, function (err, result){
      if(err) return errorResults['500'](res);
      res.send({result: 'deleted'});
    });
  };

  return this;

};
