module.exports = function(app) {

  var db = app.get('db')[0]
    , User = require('../models/User')(db)
    , crypto = require('crypto')
    , errorResults = require('./errors');

  this.index = function(req, res, next) {
    User.findAll({}, function (err, users) {
      checkErrors(err, res);
      res.send(users);
    });
  };

  this.show = function(req, res, next) {
    User.findOne({code: req.params.id}, function (err, user) {
      checkErrors(err, res);
      res.send(user);
    });
  };

  this.insert = function(req, res, next) {
    var dataToInsert = req.body;
    dataToInsert.code = crypto.randomBytes(3).toString('hex');
    dataToInsert.created_at = new Date();
    User.create(dataToInsert, {}, function(err){
      checkErrors(err, res);
      User.findOne({code: dataToInsert.code}, function (err, user) {
        checkErrors(err, res);
        res.status(201).send(user);
      });
    });
  };

  this.update = function(req, res, next) {
    // TODO : tests
    User.edit({code: req.params.id}, {$set:req.body}, {safe:true, multi:false}, function (err, result) {
      checkErrors(err, res);
      User.findOne({code: req.params.id}, function (err) {
        checkErrors(err, res);
        res.json(200);
      });
    });
  };

  this['delete'] = function(req, res, next) {
    User.remove({code: req.params.id}, function (err, result){
      checkErrors(err, res);
      res.send({result: 'deleted'});
    });
  };


  // Private

  function checkErrors (err, res) {
    if(err) {
      if(typeof err.error !== 'undefined') {
        if(typeof err.message !== 'undefined') {
          return errorResults[err.error](res, err.message);
        } else {
          return errorResults[err.error](res);
        }
      } else {
        return errorResults['500'](res);
      }
    }
  }

  return this;

};
