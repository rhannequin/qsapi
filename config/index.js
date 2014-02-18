module.exports = function(app, express) {

  app.configure('development', function() {
    require("./development.js")(app, express)
  })

}