/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , mongoskin = require('mongoskin')
  , fs = require('fs')
  , LogsUtil = require('./utils/logs')

// Initialize Express application
var app = express()

var path = __dirname

// Set middlewares
function bootApplication(app) {
  app.configure(function(){
    app.set('port', process.env.PORT || 3000)
    app.use(express.favicon())
    app.use(express.logger('dev'))
    app.use(express.bodyParser())
    app.use(express.methodOverride())
    app.use(express.cookieParser('your secret here'))
    app.use(express.session())
    app.use(app.router)
  })
}

// Define root route
function bootRoutes(app) {
  require(path + '/routes/main')(app)
}

// Initialize database connection
function bootDatabase(app, cb) {

  var connections = {}
  connections[0] = mongoskin.db(app.get('db-uri'), { w : 1 })

  app.set('db', connections)

  if(cb) {
    cb(null)
  }

}

// Import configuration
require(path + '/config/index.js')(app, express)

// Bootstrap application
bootApplication(app)
bootDatabase(app)
bootRoutes(app)

// Set environment
app.configure('development', function(){
  app.use(express.errorHandler())
})

// Launch server
http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server : Listening on port ' + app.get('port'))
  LogsUtil.greenLog('Quantified-self API ready to go !')
})
