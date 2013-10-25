module.exports = function(app) {

  var db = app.get('db')[0]
    , User = require('../models/User')(db)
    , errorResults = require('./errors');

  this.index = function(req, res, next) {

    if(typeof req.body === 'undefined' && typeof req.body.username !== 'undefined' && typeof req.body.password !== 'undefined') return errorResults['400'](res, 'Missing parameters');

    User.findOne({username: req.body.username, password: req.body.password}, function (err, user) {
      checkErrors(err, res, null, function() {
        res.send(user);
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
