var LogsUtil = require('../utils/logs')

module.exports = function(app, express) {
  var dbName = 'qsapi'
    , port = 27017

  app.set('db-name', dbName)
  app.set('db-port', port)
  app.set('db-uri', 'mongodb://localhost:' + port + '/' + dbName)
  app.set('app-salt', 'tNiDE3RqdKmCq74H')
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }))

  LogsUtil.yellowLog('Environment: development')
  LogsUtil.yellowLog('Database: ' + app.get('db-uri'))
}
