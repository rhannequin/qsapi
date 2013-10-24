module.exports = function(app) {

  var db = app.get('db')[0]
    , User = require('../models/User')(db)
    , crypto = require('crypto')
    , errorResults = require('./errors');

  function sha1(pass, salt) {
    return crypto.createHmac('sha1', salt).update(pass).digest('hex');
  }

  this.index = function(req, res, next) {
    User.findAll({}, function (err, users) {
      checkErrors(err, res, 'Could not find any users');
      res.send(users);
    });
  };

  this.show = function(req, res, next) {
    User.findOne({code: req.params.id}, function (err, user) {
      checkErrors(err, res, 'Could not find user');
      res.send(user);
    });
  };

  this.insert = function(req, res, next) {
    // TODO : tests
    //if(typeof req.body === 'undefined') return errorResults['500'](res);
    var dataToInsert = req.body;
    dataToInsert.code = crypto.randomBytes(3).toString('hex');
    dataToInsert.created_at = new Date();
    dataToInsert.access_token = sha1(dataToInsert.code + dataToInsert.created_at, app.get('app-salt'));
    User.create(dataToInsert, {}, function(err){
      checkErrors(err, res, 'Could not create user');
      User.findOne({code: dataToInsert.code}, function (err, user) {
        checkErrors(err, res, 'Created user is missing');
        res.status(201).send(user);
      });
    });

  };

  this.update = function(req, res, next) {
    // TODO : tests
    //if(typeof req.body === 'undefined') return errorResults['500'](res);
    User.edit({code: req.params.id}, {$set:req.body}, {safe:true, multi:false}, function (err, result) {
      checkErrors(err, res, 'Could not update user');
      User.findOne({code: req.params.id}, function (err) {
        checkErrors(err, res);
        res.json(200);
      });
    });
  };

  this['delete'] = function(req, res, next) {
    User.remove({code: req.params.id}, function (err, result){
      checkErrors(err, res, 'Could not delete user');
      res.send({result: 'deleted'});
    });
  };

  // Private
  function checkErrors (err, res, message) {
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
