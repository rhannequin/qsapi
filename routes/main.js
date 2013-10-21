/* API routes */

module.exports = function(app) {

  var user = require('../controllers/user')(app);

  app.get('/users', user.index);
  app.get('/users/:id', user.show);
  app.post('/users', user.create);
  app.put('/users/:id', user.update);
  app['delete']('/users/:id', user['delete']);

};