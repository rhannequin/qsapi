/* API routes */

var user = require('../controllers/user');

var config = {
  debug: true
};

module.exports = function(app) {

  app.get('/', user.index);

};