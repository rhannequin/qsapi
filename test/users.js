var should = require('should')
  , assert = require('assert')
  , request = require('supertest')
  , chai = require('chai')
  , expect = chai.expect;

describe('UsersController', function() {

  var url = 'http://localhost:3000'
    , accessToken = null;

  var user = {
    username: 'John Doe',
    password: 'password',
    email: 'john.doe@email.com'
  };

  it('should create a new user', function(done) {
    request(url)
      .post('/users')
      .send(user)
      .end(function(err, res) {
        if(err) throw err;

        // Headers
        res.should.have.status(201);
        res.should.be.json;

        // Fill user with new informations to access other routes
        u = res.body;

        // Required params returned
        u.should.have.properties(['code', 'username', 'email']);

        // Check if the values are correct
        u.username.should.equal(user.username)
        u.email.should.equal(user.email)

        // Add new element to user
        user.access_token = u.access_token;
        accessToken = '?access_token=' + user.access_token
        user.code = u.code;

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
        users = res.body;
        users.should.be.an.instanceOf(Array)
        users.length.should.be.above(0)

        // Contains inserted user
        var lastUser = users[users.length-1];
        lastUser.should.include({
          username: user.username,
          email: user.email
        });
        // TODO
        //expect(lastUser).to.not.include.keys('_id', 'password');

        done();
      });
  });



  // GET /users/1

  it('should return the user', function(done) {
    request(url)
      .get('/users/' + user.code + accessToken)
      .end(function(err, user) {
        if(err) throw err;
        done();
      });
  });


  it('should update the user', function(done) {

    var modify = {
      username: 'Jane Doe'
    };

    request(url)
      .put('/users/' + user.code + accessToken)
      .send(modify)
      .end(function(err, res) {
        if(err) throw err;
        done();
      });
  });

  it('should remove the user', function(done) {
    request(url)
      .del('/users/' + user.code + accessToken)
      .end(function(err, res) {
        if(err) throw err;
        done();
      });
  });

});

