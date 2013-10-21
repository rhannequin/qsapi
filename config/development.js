module.exports = function(app, express) {
  var dbName = 'qsapi'
    , port = 27017;

  app.set('db-name', dbName);
  app.set('db-port', port);
  app.set('db-uri', 'mongodb://localhost:' + port + '/' + dbName);
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

  console.log('\n\x1b[33mEnvironment: development');
  console.log('\x1b[33mDatabase: ' + app.get('db-uri'));
};