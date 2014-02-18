var Util = require('../utils/util')

module.exports = function(db) {

  // Get database
  var c = db.collection('drinks')
    , Drink = {}

  Drink.findAll = function(params, cb) {
    c.find(params).toArray(cb)
  }

  Drink.findOne = function(params, cb) {
    c.findOne(params, function(err, drink) {
      if (err) return cb({error: 500})
      if (drink === null) return cb({error: 404})
      return cb(null, drink)
    })
  }

  Drink.create = function(params, options, cb) {
    // Check if request is correct
    Util.checkRequiredParams(params, ['type', 'quantity', 'unit', 'date'], cb)
    c.insert(params, options, cb)
  }

  Drink.remove = function(params, cb) {
    c.remove(params, cb)
  }

  return Drink

}
