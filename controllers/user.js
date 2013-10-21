module.exports = function(app) {


  // Get database
  var db = app.get('db')[0];
  var User = db.collection('users');

  this.index = function(req, res, next) {
    var users = User.find().toArray(function (err, items) {
      if(err) {
        res.status(500).send({error: 'Internal Server Error');
      }
      res.send(items);
    });
  };

  this.show = function(req, res, next) {
    var users = User.findOne({code: req.params.id}, function (err, user) {
      res.send(user);
    });
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
