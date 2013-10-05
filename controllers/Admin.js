var BaseController = require("./Base")
  , View = require("../views/Base")
  // , parameterModel = new (require("../models/ParameterModel"))()
  // , userModel = new (require("../models/UserModel"))()
  , view

module.exports = BaseController.extend({
  name: 'Admin',

  // Creadentials
  username: 'admin',
  password: 'admin',

  /**
   * Admin Panel response callback.
   *
   * @param {Object} req The current request.
   * @param {Object} res The current response.
   * @param {Object} next Pass control to the next matching route.
   * @return {boolean} Is allowed.
   */
  run: function(req, res, next) {
    if(this.authorize(req)) {
      // parameterModel.setDB(req.db)
      // userModel.setDB(req.db)
      req.session.qsapi = true;
      req.session.save()
      view = new View(res, 'admin')
      v.render({
        title: 'Administration',
        content: 'Welcome to the control panel'
      })
    } else {
      view = new View(res, 'admin-login')
      v.render({
        title: 'Please login'
      })
    }
  },

  /**
   * Check if the user is allowed to access to Admin Panel.
   *
   * @param {Object} req The current request.
   * @return {boolean} Is allowed.
   */
  authorize: function(req) {
    return (
      req.session &&
      req.session.qsapi &&
      req.session.qsapi === true
    ) || (
      req.body &&
      req.body.username === this.username &&
      req.body.password === this.password
    )
  }
})