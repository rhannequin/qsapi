var _ = require('lodash')
  , crypto = require('crypto')
  , errorResults = require('./errors');

module.exports = (function() {

  var Util = {};

  Util.checkErrors = function(err, res, message, cb) {
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
  };

  Util.sha1 = function(pass, salt) {
    return crypto.createHmac('sha1', salt).update(pass).digest('hex');
  };

  Util.generateCode = function() {
    return crypto.randomBytes(3).toString('hex');
  };

  Util.checkRequiredParams = function(params, requiredAttributes, cb) {
    var hasnt = false;
    _.each(requiredAttributes, function(key, param) {
      hasnt = typeof params[key] === 'undefined';
      console.log(hasnt);
      if(hasnt) return cb({error: 400, message: 'Missing parameters'});
    });
  };

  return Util;

})();
