var should = require('should')
  , assert = require('assert')
  , request = require('supertest');

describe('Routing', function() {

  var url = 'http://localhost:3000';

  describe('User', function() {

    var user = {
      username: 'John Doe',
      password: 'password',
      email: 'john.doe@email.com' 
    };

    it('should create a new user', function(done) {
      request(url)
        .post('/users')
        .send(user)
        .expect('Content-Type', /json/)
        .expect(201)
        .end(function(err, res) {
          if(err) throw err;
          // Fill user with new informations to access other routes
          u = res.body;
          user.access_token = u.access_token;
          user.code = u.code;
          done();
        });
    });

    it('should update the user', function(done) {

      var modify = {
        username: 'Jane Doe'
      };

      request(url)
        .put('/users/' + user.code + '?access_token=' + user.access_token)
        .send(modify)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          if(err) throw err;
          done();
        });
    });

    it('should remove the user', function(done) {
      request(url)
        .del('/users/' + user.code + '?access_token=' + user.access_token)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          if(err) throw err;
          done();
        });
    });

    it('should return the list of users', function(done) {
      request(url)
        .get('/users?access_token=2780087e70bc33bd93659fbe29d95e566ccab5d1')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          if(err) throw err;
          done();
        });
    });

  });

});

