var User = require('./User')
  , Util = require('../utils/util');

module.exports = function(db) {

  // Get database
  var c = db.collection('locations')
    , Location = {};

  Location.findAll = function(params, cb) {
    c.find(params).toArray(cb);
  };

  Location.findOne = function(params, cb) {
    c.findOne(params, function(err, location) {
      if (err) return cb({error: 500});
      if (location === null) return cb({error: 404});
      return cb(null, location);
    });
  };

  Location.create = function(params, options, cb) {
    // Check if request is correct
    Util.checkRequiredParams(params, ['name', 'address', 'city', 'postalCode', 'country', 'lat', 'lng'], cb);
    c.insert(params, options, cb);
  };

  Location.remove = function(params, cb) {
    c.remove(params, cb);
  };

  return Location;

};
