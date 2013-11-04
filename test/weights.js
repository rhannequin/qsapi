var should = require('should')
  , assert = require('assert')
  , request = require('supertest')
  , chai = require('chai')
  , UtilTest = require('../utils/tests')
  , expect = chai.expect;

describe('WeightsController', function() {

  var url = 'http://localhost:3000'
    , accessToken = null
    , weightsUrl = null
    , weightUrl = null;

  var userCreated = {
    username: 'John Doe',
    password: 'password',
    email: 'john.doe@email.com'
  };

  var weightCreated = {
    value: 60
  };


  // POST /users + POST /users/1/weights

  it('should create a new weight', function(done) {
    request(url).post('/users').send(userCreated).end(function(err, res) {
      if(err) throw err;

      // Fill user with new informations to access other routes
      var user = res.body;

      // Add new element to user
      userCreated.access_token = user.access_token;
      accessToken = '?access_token=' + userCreated.access_token
      userCreated.code = user.code;
      weightsUrl = '/users/' + userCreated.code + '/weights';

      // POST /users/1/weights

      request(url)
        .post(weightsUrl + accessToken)
        .send(weightCreated)
        .end(function(err, res) {
          if(err) throw err;

          UtilTest.jsonAndStatus(res, 201);

          // Fill user with new informations to access other routes
          weight = res.body;
          userCreated.weights = [];
          userCreated.weights.push(weight);
          weightUrl = weightsUrl + '/' + userCreated.weights[0].code + accessToken;

          done();
        });
    });
  });


  // GET /users/1/weights

  it('should return the list of weights', function(done) {
    request(url).get(weightsUrl + accessToken).end(function(err, res) {
      if(err) throw err;

      UtilTest.jsonAndStatus(res, 200);

      // Response content
      var weights = res.body;
      weights.should.be.an.instanceOf(Array);
      weights.length.should.be.above(0);

      // Contains inserted user
      var lastWeight = weights[weights.length-1];
      lastWeight.should.include({
        value: weightCreated.value,
        author: {
          code: userCreated.code,
          email: userCreated.email,
          username: userCreated.username
        }
      });

      done();
    });
  });


  // GET /users/1/weights/1

  it('should return the created weight', function(done) {
    request(url).get(weightUrl).end(function(err, res) {
      if(err) throw err;

      UtilTest.jsonAndStatus(res, 200);

      // Response content
      var weight = res.body;
      weight.should.be.an.instanceOf(Object);

      // Contains correct keys and values
      weight.should.include({
        value: weightCreated.value,
        author: {
          code: userCreated.code,
          email: userCreated.email,
          username: userCreated.username
        }
      });

      done();
    });
  });


  // DELETE /users/1/weights/1 + /users/1

  it('should remove the user', function(done) {
    request(url).del(weightUrl).end(function(err, res) {
      if(err) throw err;

      UtilTest.jsonAndStatus(res, 200);

      // Response content
      var result = res.body;
      result.should.be.an.instanceOf(Object);

      // Gives status
      result.should.include({
        result: 'deleted'
      });

      request(url).del('/users/' + userCreated.code + accessToken).end(function(err, res) {
        if(err) throw err;
        done();
      });
    });
  });

});
