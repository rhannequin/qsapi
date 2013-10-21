module.exports = function(db) {

  // Get database
  var c = db.collection('users');

  this.findAll = function(cb) {
    c.find().toArray(cb);
  };

  this.findOne = function(params, cb) {
    c.findOne(params, cb);
  };

  return this;

};
