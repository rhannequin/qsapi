var Util = require('../utils/util')
  , errorResults = require('../utils/errors')

module.exports = function(app) {

  var db = app.get('db')[0]
    , User = require('../models/User')(db)
    , auth = {}

  auth.index = function(req, res, next) {
    var body = req.body
    if(  typeof body === 'undefined'
      || typeof body.username === 'undefined'
      || typeof body.password === 'undefined'
    ) {
      return errorResults['400'](res, 'Missing parameters')
    }

    User.findOne({
        username: body.username
      , password: body.password
    }, function (err, user) {
      Util.checkErrors(err, res, null, function() {
        res.send(user)
      })
    })
  }

  return auth

}
