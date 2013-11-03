module.exports = function(app) {

  var db = app.get('db')[0]
    , User = require('../models/User')(db)
    , crypto = require('crypto')
    , errorResults = require('./errors')
    , routes = {};

  routes.list = function(req, res, next) {
    User.findAll({}, function (err, users) {
      checkErrors(err, res, null, function() {
        res.send(users);
      });
    });
  };

  routes.show = function(req, res, next) {
    User.findOne({code: req.params.userId}, function (err, user) {
      checkErrors(err, res, null, function() {
        res.send(user);
      });
    });
  };

  routes.insert = function(req, res, next) {
    // TODO : tests
    //if(typeof req.body === 'undefined') return errorResults['500'](res);
    var dataToInsert = req.body;
    dataToInsert.code = crypto.randomBytes(3).toString('hex');
    dataToInsert.created_at = new Date();
    dataToInsert.access_token = sha1(
      dataToInsert.code + dataToInsert.created_at,
      app.get('app-salt')
    );
    User.create(dataToInsert, {}, function(err){
      checkErrors(err, res, null, function() {
        User.findOne({code: dataToInsert.code}, function (err, user) {
          checkErrors(err, res, null, function() {
            res.status(201).send(user);
          });
        });
      });
    });

  };

  routes.update = function(req, res, next) {
    // TODO : tests
    //if(typeof req.body === 'undefined') return errorResults['500'](res);
    User.edit({code: req.params.userId}, {$set:req.body}, {safe:true, multi:false}, function (err, result) {
      checkErrors(err, res, null, function() {
        User.findOne({code: req.params.userId}, function (err, user) {
          checkErrors(err, res, null, function() {
          res.json(user);
          });
        });
      });
    });
  };

  routes['delete'] = function(req, res, next) {
    User.remove({code: req.params.userId}, function (err, result){
      checkErrors(err, res, null, function() {
        res.send({result: 'deleted'});
      });
    });
  };


  // Private

  function checkErrors (err, res, message, cb) {
    if(err) {
      if(typeof err.error !== 'undefined') {
        var mes = undefined;
        if(typeof err.message !== 'undefined') {
          mes = err.message;
        }
        if(message) {
          mes = message;
        }
        return errorResults[err.error](res, mes);
      } else {
        return errorResults['500'](res);
      }
    }
    cb();
  }

  function sha1(pass, salt) {
    return crypto.createHmac('sha1', salt).update(pass).digest('hex');
  }

  return routes;

};
