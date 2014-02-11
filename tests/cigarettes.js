var should = require('should')
  , assert = require('assert')
  , request = require('supertest')
  , chai = require('chai')
  , expect = chai.expect
  , UtilTest = require('../utils/tests')
  , LogsUtil = require('../utils/logs');

describe('CigarettesController', function() {

  LogsUtil.greenLog("CigarettesController...    4  tests");

  var url = 'http://localhost:3000'
    , accessToken = null
    , cigarettesUrl = null
    , cigaretteUrl = null;

  var userCreated = {
    username: 'John Doe',
    password: 'password',
    email: 'john.doe@email.com'
  };

  var cigaretteCreated = {
    quantity: 4,
    date: new Date()
  };


  // POST /users + POST /users/1/cigarettes

  it('should create a new cigarette', function(done) {
    request(url).post('/users').send(userCreated).end(function(err, res) {
      if(err) throw err;

      // Fill user with new informations to access other routes
      var user = res.body;

      // Add new element to user
      userCreated.access_token = user.access_token;
      accessToken = '?access_token=' + userCreated.access_token
      userCreated.code = user.code;
      cigarettesUrl = '/users/' + userCreated.code + '/cigarettes';

      // POST /users/1/cigarettes

      request(url)
        .post(cigarettesUrl + accessToken)
        .send(cigaretteCreated)
        .end(function(err, res) {
          if(err) throw err;

          UtilTest.jsonAndStatus(res, 201);

          // Fill user with new informations to access other routes
          cigarette = res.body;
          userCreated.cigarettes = [];
          userCreated.cigarettes.push(cigarette);
          cigaretteUrl = cigarettesUrl + '/' + userCreated.cigarettes[0].code + accessToken;

          done();
        });
    });
  });


  // GET /users/1/cigarettes

  it('should return the list of cigarettes', function(done) {
    request(url).get(cigarettesUrl + accessToken).end(function(err, res) {
      if(err) throw err;

      UtilTest.jsonAndStatus(res, 200);

      // Response content
      var cigarettes = res.body;
      cigarettes.should.be.an.instanceOf(Array);
      cigarettes.length.should.be.above(0);

      // Contains inserted user
      var lastSleep = cigarettes[cigarettes.length-1];
      lastSleep.should.include({
        value: cigaretteCreated.value,
        author: {
          code: userCreated.code,
          email: userCreated.email,
          username: userCreated.username
        }
      });

      done();
    });
  });


  // GET /users/1/cigarettes/1

  it('should return the created cigarette', function(done) {
    request(url).get(cigaretteUrl).end(function(err, res) {
      if(err) throw err;

      UtilTest.jsonAndStatus(res, 200);

      // Response content
      var cigarette = res.body;
      cigarette.should.be.an.instanceOf(Object);

      // Contains correct keys and values
      cigarette.should.include({
        value: cigaretteCreated.value,
        author: {
          code: userCreated.code,
          email: userCreated.email,
          username: userCreated.username
        }
      });

      done();
    });
  });


  // DELETE /users/1/cigarettes/1 + /users/1

  it('should remove the user', function(done) {
    request(url).del(cigaretteUrl).end(function(err, res) {
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
