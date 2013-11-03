var Util = require('../utils/util');

module.exports = function(app) {

  var db = app.get('db')[0]
    , User = require('../models/User')(db)
    , errorResults = require('./errors')
    , auth = {};

  auth.index = function(req, res, next) {
    if(
      typeof req.body === 'undefined' &&
      typeof req.body.username !== 'undefined' &&
      typeof req.body.password !== 'undefined'
    ) {
      return errorResults['400'](res, 'Missing parameters');
    }

    User.findOne({username: req.body.username, password: req.body.password}, function (err, user) {
      Util.checkErrors(err, res, null, function() {
        res.send(user);
      });
    });
  };

  return auth;

};
