var should = require('should')
  , assert = require('assert')
  , request = require('supertest');

describe('Routing', function() {

  var url = 'http://localhost:3000'
    , accessToken = null
    , usersUrl = null
    , userUrl = null
    , weightsUrl = null
    , weightUrl = null;

  describe('User', function() {

    var user = {
      username: 'John Doe',
      password: 'password',
      email: 'john.doe@email.com'
    };

    var weightCreated = {
      unit: 'kg',
      value: 60
    };


    // POST /users

    it('should create a new user', function(done) {
      request(url).post('/users').send(user).expect(201).end(function(err, res) {
        if(err) throw err;
        // Fill user with new informations to access other routes
        u = res.body;
        user.access_token = u.access_token;
        user.code = u.code;
        var userCodeUrl = '/users/' + user.code;
        accessToken = '?access_token=' + user.access_token;
        usersUrl = '/users' + accessToken;
        userUrl = userCodeUrl + accessToken;
        weightsUrl = userCodeUrl + '/weights' + accessToken
        done();
      });
    });


    // GET /users

    it('should return the list of users', function(done) {
      request(url).get(usersUrl).expect(200).end(function(err, res) {
        if(err) throw err;
        done();
      });
    });



    // GET /users/1

    it('should return the user', function(done) {
      request(url).get(userUrl).expect(200).end(function(err, user) {
        if(err) throw err;
        done();
      });
    });


    // PUT /users/1

    it('should update the user', function(done) {

      var modify = {
        username: 'Jane Doe'
      };

      request(url).put(userUrl).send(modify).expect(200).end(function(err, res) {
        if(err) throw err;
        done();
      });
    });


    // GET /users/1/weights

    it('should return the list of weights', function(done) {
      request(url).get(weightsUrl).expect(200).end(function(err, res) {
        if(err) throw err;
        done();
      });
    });


    // POST /users/1/weights

    it('should create a new weight entry', function(done) {
      request(url)
        .post(weightsUrl)
        .send(weightCreated)
        .expect(201)
        .end(function(err, res) {
          if(err) throw err;
          // Fill user with new informations to access other routes
          weight = res.body;
          user.weights = [];
          user.weights.push(weight);
          weightUrl = '/users/' + user.code + '/weights/' +
                      user.weights[0].code + accessToken;
          done();
        });
    });


    // GET /users/1/weights/1

    it('should return the user', function(done) {
      request(url).get(weightUrl).expect(200).end(function(err, user) {
        if(err) throw err;
        done();
      });
    });


    // DELETE /users/1/weights/1

    it('should remove the weight', function(done) {
      request(url).del(weightUrl).expect(200).end(function(err, user) {
        if(err) throw err;
        done();
      });
    });


    // DELETE /users/1

    it('should remove the user', function(done) {
      request(url).del(userUrl).expect(200).end(function(err, res) {
        if(err) throw err;
        done();
      });
    });

  });

});

