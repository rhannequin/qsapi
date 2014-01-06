var Util = require('../utils/util');

module.exports = function(db) {

  // Get database
  var c = db.collection('weights')
    , Weight = {};

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
    Util.checkRequiredParams(params, ['value','unit'], cb);
    c.insert(params, options, cb);
  };

  Weight.remove = function(params, cb) {
    c.remove(params, cb);
  };

  return Weight;

};
