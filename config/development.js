module.exports = function(app, express) {
  var db = 'qsapi';
  app.set('db-name', db);
  app.set('db-uri', 'mongodb://localhost/' + db);
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

  console.log('\n\x1b[33mLaunching in : development');
  console.log('\x1b[33mDatabase : ' + app.set('db-name'));
};