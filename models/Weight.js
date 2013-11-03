var _ = require('lodash')
  , User = require('./User');

module.exports = function(db) {

  // Get database
  var c = db.collection('weights')
    , Weight = {};

  Weight.requiredAttributes = [
    'value'
  ];

  Weight.findAll = function(params, cb) {
    c.find(params).toArray(cb);
  };

  Weight.findOne = function(params, cb) {
    c.findOne(params, function(err, weight) {
      if (err) return cb({error: 500});
      if (weight === null) return cb({error: 404});
      return cb(null, weight);
    });
  };

  Weight.create = function(params, options, cb) {
    // Check if request is correct
    hasRequiredParams(params, cb);
    c.insert(params, options, cb);
  };


  // Private

  function hasRequiredParams(params, cb) {
    var hasnt = false;
    _.each(User.requiredAttributes, function(key, param) {
      hasnt = typeof params[key] === 'undefined';
      if(hasnt) return cb({error: 400, message: 'Missing parameters'});
    });
  }

  return Weight;

};
