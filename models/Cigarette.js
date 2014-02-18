var Util = require('../utils/util')

module.exports = function(db) {

  // Get database
  var c = db.collection('cigarettes')
    , Cigarette = {}

  Cigarette.findAll = function(params, cb) {
    c.find(params).toArray(cb)
  }

  Cigarette.findOne = function(params, cb) {
    c.findOne(params, function(err, cigarette) {
      if (err) return cb({error: 500})
      if (cigarette === null) return cb({error: 404})
      return cb(null, cigarette)
    })
  }

  Cigarette.create = function(params, options, cb) {
    // Check if request is correct
    Util.checkRequiredParams(params, ['quantity', 'date'], cb)
    c.insert(params, options, cb)
  }

  Cigarette.remove = function(params, cb) {
    c.remove(params, cb)
  }

  return Cigarette

}
