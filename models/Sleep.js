var Util = require('../utils/util')

module.exports = function(db) {

  // Get database
  var c = db.collection('sleeps')
    , Sleep = {}

  Sleep.findAll = function(params, cb) {
    c.find(params).toArray(cb)
  }

  Sleep.findOne = function(params, cb) {
    c.findOne(params, function(err, sleep) {
      if (err) return cb({error: 500})
      if (sleep === null) return cb({error: 404})
      return cb(null, sleep)
    })
  }

  Sleep.create = function(params, options, cb) {
    // Check if request is correct
    Util.checkRequiredParams(params, ['start', 'end'], cb)
    c.insert(params, options, cb)
  }

  Sleep.remove = function(params, cb) {
    c.remove(params, cb)
  }

  return Sleep

}
