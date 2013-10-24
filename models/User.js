var _ = require('lodash');

module.exports = function(db) {

  // Get database
  var c = db.collection('users')
    , User = this;

  User.requiredAttributes = [
    'username',
    'password',
    'email'
  ];

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
    hasRequiredParams(params, cb);
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


  // Private

  function hasRequiredParams(params, cb) {
    var hasnt = false;
    _.each(User.requiredAttributes, function(key, param) {
      hasnt = typeof params[key] === 'undefined';
      if(hasnt) return cb({error: 400, message: 'Missing parameters'});
    });
  }

  return User;

};
