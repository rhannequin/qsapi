/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , mongoskin = require('mongoskin')
  , fs = require('fs');

var app = express();
var path = __dirname;

function bootApplication(app) {
  app.configure(function(){
    app.set('port', process.env.PORT || 3000);
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser('your secret here'));
    app.use(express.session());
    app.use(app.router);
    app.use(express.static(path + '/public'));
  });
}

function bootRoutes(app) {
  require(path + '/routes/main')(app);
}

function bootDatabase(app, cb) {

  var db_type = '';
  if (process.env.NODE_ENV !== 'production') {
    db_type = '_dev';
  }

  app.set('db_type', db_type);

  var connections = {};
  connections[0] = mongoskin.db('localhost:27017/qsapi_dev', { w : 'majority'});

  if(cb) {
    cb(null);
  }

}

// Import configuration
require(path + '/config/index.js')(app, express);

// Bootstrap application
bootApplication(app);
bootRoutes(app);
bootDatabase(app);

app.configure('development', function(){
  app.use(express.errorHandler())
});

// Launch server
http.createServer(app).listen(3000, function(){
  console.log('Express server listening on port ' + 3000)
});
