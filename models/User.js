// Require Util files
var Util = require('../utils/util')

// Define the module with the database connection instance as parameter
module.exports = function(db) {

    // Get database
  var c = db.collection('users')
    // Define the returned object
    , User = {}

  // Get a list of User
  User.findAll = function(params, cb) {
    c.find(params).toArray(cb)
  }

  // Get one single User
  User.findOne = function(params, cb) {
    c.findOne(params, function(err, user) {
      if (err) return cb({error: 500})
      if (user === null) return cb({error: 404})
      return cb(null, user)
    })
  }

  // Add a User
  User.create = function(params, options, cb) {
    // Check if request is correct
    Util.checkRequiredParams(params, ['username','password','email'], cb)
    // Check if user already exists
    var p = { username: params.username, $or: [{ email: params.email }] }
    User.findAll(p, function(err, user) {
      if(user.length) return cb({error: 409})
      c.insert(params, options, cb)
    })
  }

  // Update a User
  User.edit = function(params, update, options, cb) {
    c.update(params, update, options, cb)
  }

  // Delete a User
  User.remove = function(params, cb) {
    c.remove(params, cb)
  }

  // Return the object filled with methods
  return User

}
