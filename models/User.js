module.exports = function(db) {

  // Get database
  var c = db.collection('users');

  this.findAll = function(cb) {
    c.find().toArray(cb);
  };

  this.findOne = function(params, cb) {
    c.findOne(params, cb);
  };

  this.update = function (params, update, options, cb) {
    c.update(params, update, options, cb);
  };

  this.remove = function (params, cb) {
    c.remove(params, cb);
  };

return this;

};
