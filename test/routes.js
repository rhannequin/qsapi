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


    // POST /users

    it('should create a new user', function(done) {
      request(url)
        .post('/users')
        .send(user)
        .expect(201)
        .end(function(err, res) {
          if(err) throw err;
          // Fill user with new informations to access other routes
          u = res.body;
          user.access_token = u.access_token;
          accessToken = '?access_token=' + user.access_token
          user.code = u.code;
          done();
        });
    });


    // GET /users

    it('should return the list of users', function(done) {
      request(url)
        .get('/users' + accessToken)
        .expect(200)
        .end(function(err, res) {
          if(err) throw err;
          done();
        });
    });



    // GET /users/1

    it('should return the user', function(done) {
      request(url)
        .get('/users/' + user.code + accessToken)
        .expect(200)
        .end(function(err, user) {
          if(err) throw err;
          done();
        });
    });


    // PUT /users/1

    it('should update the user', function(done) {

      var modify = {
        username: 'Jane Doe'
      };

      request(url)
        .put('/users/' + user.code + accessToken)
        .send(modify)
        .expect(200)
        .end(function(err, res) {
          if(err) throw err;
          done();
        });
    });



    // DELETE /users/1

    it('should remove the user', function(done) {
      request(url)
        .del('/users/' + user.code + accessToken)
        .expect(200)
        .end(function(err, res) {
          if(err) throw err;
          done();
        });
    });

  });

});

