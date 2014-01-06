// Require User model
var Util = require('../utils/util');

module.exports = function(db) {

  // Get database
  var c = db.collection('heights')
    , Height = {};

  Height.findAll = function(params, cb) {
    c.find(params).toArray(cb);
  };

  Height.findOne = function(params, cb) {
    c.findOne(params, function(err, height) {
      if (err) return cb({error: 500});
      if (height === null) return cb({error: 404});
      return cb(null, height);
    });
  };

  Height.create = function(params, options, cb) {
    // Check if request is correct
    Util.checkRequiredParams(params, ['value','unit'], cb);
    c.insert(params, options, cb);
  };

  Height.remove = function(params, cb) {
    c.remove(params, cb);
  };

  return Height;

};
