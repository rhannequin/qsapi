var Model = require("./Base")
  , crypto = require("crypto")
  , model = new Model()

var ContentModel = model.extend({
  collectionName: 'users',
  insert: function(data, callback) {
    data.ID = crypto.randomBytes(6).toString('hex')
    this.collection().insert(data, {}, callback || function(){})
  },
  update: function(data, callback) {
    this.collection().update({ID: data.ID}, data, {}, callback || function(){})
  },
  find: function(callback, query, projection) {
    projection = projection || { _id: 0 } // Remove technical id from results
    this.collection().find((query || {}), projection).toArray(callback)
  },
  findOne: function(callback, query, projection) {
    projection = projection || { _id: 0 } // Remove technical id from results
    this.collection().findOne(query, projection, callback)
  },
  remove: function(ID, callback) {
    this.collection().findAndModify({ID: ID}, [], {}, {remove: true}, callback)
  }
})

module.exports = ContentModel