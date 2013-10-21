module.exports = function(app) {

  // Get database
  var db = app.get('db')[0];

  var User = require('../models/User')(db);

  this.index = function(req, res, next) {
    User.findAll(function (err, users) {
      if(err) {
        res.status(500).send({error: 'Internal Server Error'});
        return;
      }
      res.send(users);
    });
  };

  this.show = function(req, res, next) {
    User.findOne({code: req.params.id}, function (err, user) {
      res.send(user);
      return;
    });
  };

  this.create = function(req, res, next) {
    // TODO
    res.send({});
  };

  this.update = function(req, res, next) {
    User.update({code: req.params.id}, {$set:req.body}, {safe:true, multi:false}, function (err, result) {
      if(err){
        res.status(500).send({error: 'Internal Server Error'});
        return;
      }
      res.send(result);
    });
  };

  this.remove = function(req, res, next) {
    User.remove({code: req.params.id}, function (err, result){
      if(err){
        res.status(500).send({error: 'Internal Server Error'});
        return;
      }
      res.send(result);
    });
  };

  return this;

};
