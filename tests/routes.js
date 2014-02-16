var should = require('should')
  , assert = require('assert')
  , request = require('supertest')
  , LogsUtil = require('../utils/logs');

describe('Routing', function() {

  LogsUtil.greenLog("Routing...             24 tests");

  var url = 'http://localhost:3000'
    , accessToken = null
    , usersUrl = null
    , userUrl = null
    , weightsUrl = null
    , weightUrl = null
    , heightsUrl = null
    , heightUrl = null
    , locationsUrl = null
    , locationUrl = null
    , sleepsUrl = null
    , sleepUrl = null
    , drinksUrl = null
    , drinkUrl = null
    , cigarettesUrl = null
    , cigaretteUrl = null
    , sportsUrl = null
    , sportUrl = null;

  describe('User', function() {

    var user = {
      username: 'John Doe',
      password: 'password',
      email: 'john.doe@email.com'
    };

    var weightCreated = {
      unit: 'kg',
      value: 60,
      date: new Date()
    };

    var heightCreated = {
      unit: 'cm',
      value: 175,
      date: new Date()
    };

    var locationCreated = {
      name: 'Home',
      address: '61 rue lafayette',
      city: 'Pontault-Combault',
      postalCode: '77340',
      country: 'France',
      lat: '48.79534',
      lng: '2.61545',
      date: new Date()
    };

    var sleepCreated = (function(){
      var now = new Date();
      var start = new Date(now);
      var end = new Date(now);
      start.setHours(22);
      end.setHours(22 + 8);
      return {
        start: start,
        end: end
      }
    })();

    var drinkCreated = {
      type: 'Red wine',
      quantity: 25,
      unit: 'cl',
      date: new Date()
    };

    var cigaretteCreated = {
      quantity: 4,
      date: new Date()
    };

    var sportCreated = {
      type: 'Soccer',
      duration: 60,
      date: new Date()
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
        sleepsUrl = userCodeUrl + '/sleeps' + accessToken;
        drinksUrl = userCodeUrl + '/drinks' + accessToken;
        cigarettesUrl = userCodeUrl + '/cigarettes' + accessToken;
        sportsUrl = userCodeUrl + '/sports' + accessToken;
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

    it('should remove the height', function(done) {
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


    // GET /users/1/sleeps

    it('should return the list of sleeps', function(done) {
      request(url).get(sleepsUrl).expect(200).end(function(err, res) {
        if(err) throw err;
        done();
      });
    });


    // POST /users/1/sleeps

    it('should create a new sleep entry', function(done) {
      request(url)
        .post(sleepsUrl)
        .send(sleepCreated)
        .expect(201)
        .end(function(err, res) {
          if(err) throw err;
          // Fill user with new informations to access other routes
          sleep = res.body;
          user.sleeps = [];
          user.sleeps.push(sleep);
          sleepUrl = '/users/' + user.code + '/sleeps/' +
                      user.sleeps[0].code + accessToken;
          done();
        });
    });


    // GET /users/1/sleeps/1

    it('should return the user', function(done) {
      request(url).get(sleepUrl).expect(200).end(function(err, user) {
        if(err) throw err;
        done();
      });
    });


    // DELETE /users/1/sleeps/1

    it('should remove the sleep', function(done) {
      request(url).del(sleepUrl).expect(200).end(function(err, user) {
        if(err) throw err;
        done();
      });
    });


    // GET /users/1/drinks

    it('should return the list of drinks', function(done) {
      request(url).get(drinksUrl).expect(200).end(function(err, res) {
        if(err) throw err;
        done();
      });
    });


    // POST /users/1/drinks

    it('should create a new drink entry', function(done) {
      request(url)
        .post(drinksUrl)
        .send(drinkCreated)
        .expect(201)
        .end(function(err, res) {
          if(err) throw err;
          // Fill user with new informations to access other routes
          drink = res.body;
          user.drinks = [];
          user.drinks.push(drink);
          drinkUrl = '/users/' + user.code + '/drinks/' +
                      user.drinks[0].code + accessToken;
          done();
        });
    });


    // GET /users/1/drinks/1

    it('should return the user', function(done) {
      request(url).get(drinkUrl).expect(200).end(function(err, user) {
        if(err) throw err;
        done();
      });
    });


    // DELETE /users/1/drinks/1

    it('should remove the drink', function(done) {
      request(url).del(drinkUrl).expect(200).end(function(err, user) {
        if(err) throw err;
        done();
      });
    });



    // GET /users/1/cigarettes

    it('should return the list of cigarettes', function(done) {
      request(url).get(cigarettesUrl).expect(200).end(function(err, res) {
        if(err) throw err;
        done();
      });
    });


    // POST /users/1/cigarettes

    it('should create a new cigarette entry', function(done) {
      request(url)
        .post(cigarettesUrl)
        .send(cigaretteCreated)
        .expect(201)
        .end(function(err, res) {
          if(err) throw err;
          // Fill user with new informations to access other routes
          cigarette = res.body;
          user.cigarettes = [];
          user.cigarettes.push(cigarette);
          cigaretteUrl = '/users/' + user.code + '/cigarettes/' +
            user.cigarettes[0].code + accessToken;
          done();
        });
    });


    // GET /users/1/cigarettes/1

    it('should return the user', function(done) {
      request(url).get(cigaretteUrl).expect(200).end(function(err, user) {
        if(err) throw err;
        done();
      });
    });


    // DELETE /users/1/cigarettes/1

    it('should remove the cigarette', function(done) {
      request(url).del(cigaretteUrl).expect(200).end(function(err, user) {
        if(err) throw err;
        done();
      });
    });



    // GET /users/1/sports

    it('should return the list of sports', function(done) {
      request(url).get(sportsUrl).expect(200).end(function(err, res) {
        if(err) throw err;
        done();
      });
    });


    // POST /users/1/sports

    it('should create a new sport entry', function(done) {
      request(url)
        .post(sportsUrl)
        .send(sportCreated)
        .expect(201)
        .end(function(err, res) {
          if(err) throw err;
          // Fill user with new informations to access other routes
          sport = res.body;
          user.sports = [];
          user.sports.push(sport);
          sportUrl = '/users/' + user.code + '/sports/' +
            user.sports[0].code + accessToken;
          done();
        });
    });


    // GET /users/1/sports/1

    it('should return the user', function(done) {
      request(url).get(sportUrl).expect(200).end(function(err, user) {
        if(err) throw err;
        done();
      });
    });


    // DELETE /users/1/sports/1

    it('should remove the sport', function(done) {
      request(url).del(sportUrl).expect(200).end(function(err, user) {
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

