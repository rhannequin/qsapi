var request = require('supertest');

module.exports = (function() {

  var Util = {};

  Util.jsonAndStatus = function(res, status) {
    res.should.have.status(status);
    res.should.be.json;
  };

  Util.notAvailable = function(url, method, resource) {
    it('should not be available without a token', function(done) {
      request(url)
        [method](resource)
        .end(function(err, res) {
          if(err) throw err;
          res.should.have.status(401);
          done();
        })
    });
  };

  return Util;

})();
