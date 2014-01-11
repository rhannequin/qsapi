var should = require('should')
  , assert = require('assert')
  , request = require('supertest')
  , LogsUtil = require('../utils/logs');

describe('Routing', function() {

  LogsUtil.greenLog("Routing...             17 tests");

  var url = 'http://localhost:3000'
    , accessToken = null
    , usersUrl = null
    , userUrl = null
    , weightsUrl = null
    , weightUrl = null
    , heightsUrl = null
    , heightUrl = null
    , locationsUrl = null
    , locationUrl = null;

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

    var heightCreated = {
      unit: 'cm',
      value: 175
    };

    var locationCreated = {
      name: 'Home',
      address: '61 rue lafayette',
      city: 'Pontault-Combault',
      postalCode: '77340',
      country: 'France',
      lat: '48.79534',
      lng: '2.61545'
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
        weightsUrl = userCodeUrl + '/weights' + accessToken;
        heightsUrl = userCodeUrl + '/heights' + accessToken;
        locationsUrl = userCodeUrl + '/locations' + accessToken;
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

    // GET /users/1/heights

    it('should return the list of heights', function(done) {
      request(url).get(heightsUrl).expect(200).end(function(err, res) {
        if(err) throw err;
        done();
      });
    });


    // POST /users/1/heights

    it('should create a new height entry', function(done) {
      request(url)
        .post(heightsUrl)
        .send(heightCreated)
        .expect(201)
        .end(function(err, res) {
          if(err) throw err;
          // Fill user with new informations to access other routes
          height = res.body;
          user.heights = [];
          user.heights.push(height);
          heightUrl = '/users/' + user.code + '/heights/' +
            user.heights[0].code + accessToken;
          done();
        });
    });


    // GET /users/1/heights/1

    it('should return the user', function(done) {
      request(url).get(heightUrl).expect(200).end(function(err, user) {
        if(err) throw err;
        done();
      });
    });


    // DELETE /users/1/heights/1

    it('should remove the weight', function(done) {
      request(url).del(heightUrl).expect(200).end(function(err, user) {
        if(err) throw err;
        done();
      });
    });

    // GET /users/1/locations

    it('should return the list of locations', function(done) {
      request(url).get(locationsUrl).expect(200).end(function(err, res) {
        if(err) throw err;
        done();
      });
    });


    // POST /users/1/locations

    it('should create a new location entry', function(done) {
      request(url)
        .post(locationsUrl)
        .send(locationCreated)
        .expect(201)
        .end(function(err, res) {
          if(err) throw err;
          // Fill user with new informations to access other routes
          location = res.body;
          user.locations = [];
          user.locations.push(location);
          locationUrl = '/users/' + user.code + '/locations/' +
            user.locations[0].code + accessToken;
          done();
        });
    });


    // GET /users/1/locations/1

    it('should return the location', function(done) {
      request(url).get(locationUrl).expect(200).end(function(err, user) {
        if(err) throw err;
        done();
      });
    });


    // DELETE /users/1/locations/1

    it('should remove the location', function(done) {
      request(url).del(locationUrl).expect(200).end(function(err, user) {
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

