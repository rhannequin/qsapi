module.exports = function(app) {

  // Get database
  var db = app.get('db');

  this.index = function(req, res, next) {
    res.send([{name: 'user1'}, {name: 'user2'}, {name: 'user3'}]);
  };

  this.show = function(req, res, next) {
    res.send({id:req.params.id, name: "The Name", description: "description"});
  };

  this.create = function(req, res, next) {
    // TODO
    res.send({});
  };

  this.update = function(req, res, next) {
    // TODO
    res.send({});
  };

  this.remove = function(req, res, next) {
    // TODO
    res.send({});
  };

  return this;

};
