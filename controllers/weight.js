module.exports = function(app) {

  var db = app.get('db')[0]
    , Weight = require('../models/Weight')(db)
    , User = require('../models/User')(db)
    , crypto = require('crypto')
    , errorResults = require('./errors');

  function sha1(pass, salt) {
    return crypto.createHmac('sha1', salt).update(pass).digest('hex');
  }

  this.list = function(req, res, next) {
    Weight.findAll({}, function (err, weights) {
      checkErrors(err, res, null, function() {
        res.send(weights);
      });
    });
  };

  this.show = function(req, res, next) {
    Weight.findOne({code: req.params.id_weight}, function (err, weight) {
      checkErrors(err, res, null, function() {
        res.send(weight);
      });
    });
  };

  this.insert = function(req, res, next) {
    var dataToInsert = req.body;
    dataToInsert.code = crypto.randomBytes(3).toString('hex');
    dataToInsert.created_at = new Date();
    User.findOne({code: req.params.id_user}, function (err, user) {
      checkErrors(err, res, null, function() {
        dataToInsert.author = {
          code : user.code,
          email : user.email,
          name : user.username
        };
      });
    });
    Weight.create(dataToInsert, {}, function(err){
      checkErrors(err, res, null, function() {
        Weight.findOne({code: dataToInsert.code}, function (err, weight) {
          checkErrors(err, res, null, function() {
            res.status(201).send(weight);
          });
        });
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

  return this;

};
