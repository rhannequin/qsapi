module.exports = function(db) {

  // Get database
  var c = db.collection('users')
    , self = this;

  this.findAll = function(cb) {
    c.find().toArray(cb);
  };

  this.findOne = function(params, cb) {
    c.findOne(params, cb);
  };

  this.create = function(params, options, cb) {
    // Check if user already exists
    var p = {name: params.name};
    self.findOne(p, function(err, user) {
      if(user) return cb({error: 409});
      c.insert(params, options, cb);
    });
  };

  this.edit = function(params, update, options, cb) {
    c.update(params, update, options, cb);
  };

  this.remove = function (params, cb) {
    c.remove(params, cb);
  };

  return this;

};
