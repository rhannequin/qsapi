var Util = require('../utils/util');

module.exports = function(db) {

  // Get database
  var c = db.collection('sports')
    , Sport = {};

  Sport.findAll = function(params, cb) {
    c.find(params).toArray(cb);
  };

  Sport.findOne = function(params, cb) {
    c.findOne(params, function(err, sport) {
      if (err) return cb({error: 500});
      if (sport === null) return cb({error: 404});
      return cb(null, sport);
    });
  };

  Sport.create = function(params, options, cb) {
    // Check if request is correct
    Util.checkRequiredParams(params, ['type', 'duration', 'date'], cb);
    c.insert(params, options, cb);
  };

  Sport.remove = function(params, cb) {
    c.remove(params, cb);
  };

  return Sport;

};
