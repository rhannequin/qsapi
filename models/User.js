var Util = require('../utils/util');

module.exports = function(db) {

  // Get database
  var c = db.collection('users')
    , User = {};

  User.findAll = function(params, cb) {
    c.find(params).toArray(cb);
  };

  User.findOne = function(params, cb) {
    c.findOne(params, function(err, user) {
      if (err) return cb({error: 500});
      if (user === null) return cb({error: 404});
      return cb(null, user);
    });
  };

  User.create = function(params, options, cb) {
    // Check if request is correct
    Util.checkRequiredParams(params, ['username','password','email'], cb);
    // Check if user already exists
    var p = { username: params.username, $or: [{ email: params.email }] };
    User.findAll(p, function(err, user) {
      if(user.length) return cb({error: 409});
      c.insert(params, options, cb);
    });
  };

  User.edit = function(params, update, options, cb) {
    c.update(params, update, options, cb);
  };

  User.remove = function(params, cb) {
    c.remove(params, cb);
  };

  return User;

};
