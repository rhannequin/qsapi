
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
  , config = require('./config')()
  , MongoClient = require('mongodb').MongoClient

var app = express()

app.configure(function(){
  app.set('port', process.env.PORT || 3000)
  app.set('views', __dirname + '/views')
  app.set('view engine', 'hjs')
  app.use(express.favicon())
  app.use(express.logger('dev'))
  app.use(express.bodyParser())
  app.use(express.methodOverride())
  app.use(express.cookieParser('your secret here'))
  app.use(express.session())
  app.use(app.router)
  app.use(require('stylus').middleware(__dirname + '/public'))
  app.use(express.static(path.join(__dirname, 'public')))
})

app.configure('development', function(){
  app.use(express.errorHandler())
})

app.set('views', __dirname + '/templates')

MongoClient.connect('mongodb://' + config.mongo.host + ':' + config.mongo.port + '/' + config.mongo.dbName, function(err, db) {
  if(err) {
    console.log('Sorry, there is no mongo db server running.')
  } else {
    // Attach database to each request object
    var attachDB = function(req, res, next) {
      req.db = db
      next()
    }

    var routes = require('./routes/main')(app)

    // Launch server
    http.createServer(app).listen(config.port, function(){
      console.log('Express server listening on port ' + config.port)
    })
  }
})
