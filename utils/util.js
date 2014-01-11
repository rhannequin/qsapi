var _ = require('lodash')
  , crypto = require('crypto')
  , errorResults = require('./errors')

module.exports = (function() {

  var Util = {}

  Util.checkErrors = function(err, res, message, cb) {
    var mes
    if(err) {
      if(typeof err.error !== 'undefined') {
        mes = null
        if(typeof err.message !== 'undefined') mes = err.message
        if(message) mes = message
        return errorResults[err.error](res, mes)
      }
      return errorResults['500'](res)
    }
    cb()
  }

  Util.sha1 = function(pass, salt) {
    return crypto.createHmac('sha1', salt).update(pass).digest('hex')
  }

  Util.generateCode = function() {
    return crypto.randomBytes(3).toString('hex')
  }

  Util.checkRequiredParams = function(params, requiredAttributes, cb) {
    var hasnt = false
    _.each(requiredAttributes, function(key, param) {
      hasnt = typeof params[key] === 'undefined'
      if(hasnt) return cb({error: 400, message: 'Missing parameters'})
    })
  }

  return Util

})()
