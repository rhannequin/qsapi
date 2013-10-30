var should = require('should')
  , assert = require('assert')
  , request = require('supertest')
  , chai = require('chai')
  , expect = chai.expect;

describe('UsersController', function() {

  var url = 'http://localhost:3000'
    , accessToken = null;

  var userCreated = {
    username: 'John Doe',
    password: 'password',
    email: 'john.doe@email.com'
  };

  var modify = {
    username: 'Jane Doe'
  };


  // POST /users

  it('should create a new user', function(done) {
    request(url)
      .post('/users')
      .send(userCreated)
      .end(function(err, res) {
        if(err) throw err;

        jsonAndStatus(res, 201);

        // Fill user with new informations to access other routes
        var user = res.body;

        // Required params returned
        user.should.have.properties(['code', 'username', 'email']);

        // Check if the values are correct
        user.username.should.equal(userCreated.username)
        user.email.should.equal(userCreated.email)

        // Add new element to user
        userCreated.access_token = user.access_token;
        accessToken = '?access_token=' + userCreated.access_token
        userCreated.code = user.code;

        done();
      });
  });

  it('should not create a new user', function(done) {
    request(url)
      .post('/users')
      .send(userCreated)
      .end(function(err, res) {
        if(err) throw err;
        jsonAndStatus(res, 409)
        done();
      });
  });


  // GET /users

  it('should return the list of users', function(done) {
    request(url)
      .get('/users' + accessToken)
      .end(function(err, res) {
        if(err) throw err;

        jsonAndStatus(res, 200);

        // Response content
        var users = res.body;
        users.should.be.an.instanceOf(Array);
        users.length.should.be.above(0);

        // Contains inserted user
        var lastUser = users[users.length-1];
        lastUser.should.include({
          username: userCreated.username,
          email: userCreated.email
        });
        // TODO
        //expect(lastUser).to.not.include.keys('_id', 'password');

        done();
      });
  });

  notAvailable(url, 'get', '/users');



  // GET /users/1

  it('should return the user', function(done) {
    request(url)
      .get('/users/' + userCreated.code + accessToken)
      .end(function(err, res) {
        if(err) throw err;

        jsonAndStatus(res, 200);

        // Response content
        var user = res.body;
        user.should.be.an.instanceOf(Object);

        // Contains correct keys and values
        user.should.include(userCreated);
        // TODO
        //expect(user).to.not.include.keys('_id', 'password');

        done();
      });
  });

  notAvailable(url, 'get', '/users/' + userCreated.code);


  // PUT /users/1

  it('should update the user', function(done) {

    request(url)
      .put('/users/' + userCreated.code + accessToken)
      .send(modify)
      .end(function(err, res) {
        if(err) throw err;

        jsonAndStatus(res, 200);

        // Response content
        var user = res.body;
        user.should.be.an.instanceOf(Object);

        // Contains correct keys and values
        user.should.include({
          username: modify.username,
          email: userCreated.email,
          code: userCreated.code
        });

        done();
      });
  });

  notAvailable(url, 'put', '/users/' + userCreated.code);


  // DELETE /users/1

  it('should remove the user', function(done) {
    request(url)
      .del('/users/' + userCreated.code + accessToken)
      .end(function(err, res) {
        if(err) throw err;

        jsonAndStatus(res, 200);

        // Response content
        var result = res.body;
        result.should.be.an.instanceOf(Object);

        // Gives status
        result.should.include({
          result: 'deleted'
        });

        done();
      });
  });

  notAvailable(url, 'del', '/users/' + userCreated.code);

  function notAvailable(url, method, resource) {
    it('should not be available without a token', function(done) {
      request(url)
        [method](resource)
        .end(function(err, res) {
          if(err) throw err;
          res.should.have.status(401);
          done();
        })
    });
  }

  function jsonAndStatus(res, status) {
    res.should.have.status(status);
    res.should.be.json;
  }

});

