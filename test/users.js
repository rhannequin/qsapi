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

  it('should create a new user', function(done) {
    request(url)
      .post('/users')
      .send(userCreated)
      .end(function(err, res) {
        if(err) throw err;

        // Headers
        res.should.have.status(201);
        res.should.be.json;

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

  it('should return the list of users', function(done) {
    request(url)
      .get('/users' + accessToken)
      .end(function(err, res) {
        if(err) throw err;

        // Headers
        res.should.have.status(200);
        res.should.be.json;

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



  // GET /users/1

  it('should return the user', function(done) {
    request(url)
      .get('/users/' + userCreated.code + accessToken)
      .end(function(err, res) {
        if(err) throw err;

        // Headers
        res.should.have.status(200);
        res.should.be.json;

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


  it('should update the user', function(done) {

    var modify = {
      username: 'Jane Doe'
    };

    request(url)
      .put('/users/' + userCreated.code + accessToken)
      .send(modify)
      .end(function(err, res) {
        if(err) throw err;

        // Header
        res.should.have.status(200);
        res.should.be.json;

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

  it('should remove the user', function(done) {
    request(url)
      .del('/users/' + userCreated.code + accessToken)
      .end(function(err, res) {
        if(err) throw err;

        // Header
        res.should.have.status(200);
        res.should.be.json;

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

});

