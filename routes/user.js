var User = new (require("../models/UserModel"))()

exports.list = function(req, res, next) {
  User.setDB(req.db)
  User.find(function(err, users) {
    if(err) {
      return res.json(500, { error: 'Internal Server Error' })
    }
    res.json(users)
  })
}

exports.show = function(req, res, next) {
  var id = req.params.id
  User.setDB(req.db)
  User.findOne(function(err, user) {
    if(err) {
      return res.json(500, { error: 'Internal Server Error' })
    }
    if(!user) {
      return res.json(404, { error: 'Not found' })
    }
    res.json(user)
  }, { ID: id })
}

exports.create = function(req, res, next) {
  var data = req.body
  User.setDB(req.db)
  User.insert(data, function(err, users) {
    var user = users[0]
    // Remove technical id,
    // can't be set to `insert` method parameters
    delete user._id
    res.json(user)
  })
}
