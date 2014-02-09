var should = require('should')
  , assert = require('assert')
  , request = require('supertest')
  , chai = require('chai')
  , expect = chai.expect
  , UtilTest = require('../utils/tests')
  , LogsUtil = require('../utils/logs');

describe('DrinksController', function() {

  LogsUtil.greenLog("DrinksController...    4  tests");

  var url = 'http://localhost:3000'
    , accessToken = null
    , drinksUrl = null
    , drinkUrl = null;

  var userCreated = {
    username: 'John Doe',
    password: 'password',
    email: 'john.doe@email.com'
  };

  var drinkCreated = {
    type: 'Red wine',
    quantity: 25,
    unit: 'cl',
    date: new Date()
  };


  // POST /users + POST /users/1/drinks

  it('should create a new drink', function(done) {
    request(url).post('/users').send(userCreated).end(function(err, res) {
      if(err) throw err;

      // Fill user with new informations to access other routes
      var user = res.body;

      // Add new element to user
      userCreated.access_token = user.access_token;
      accessToken = '?access_token=' + userCreated.access_token
      userCreated.code = user.code;
      drinksUrl = '/users/' + userCreated.code + '/drinks';

      // POST /users/1/drinks

      request(url)
        .post(drinksUrl + accessToken)
        .send(drinkCreated)
        .end(function(err, res) {
          if(err) throw err;

          UtilTest.jsonAndStatus(res, 201);

          // Fill user with new informations to access other routes
          drink = res.body;
          userCreated.drinks = [];
          userCreated.drinks.push(drink);
          drinkUrl = drinksUrl + '/' + userCreated.drinks[0].code + accessToken;

          done();
        });
    });
  });


  // GET /users/1/drinks

  it('should return the list of drinks', function(done) {
    request(url).get(drinksUrl + accessToken).end(function(err, res) {
      if(err) throw err;

      UtilTest.jsonAndStatus(res, 200);

      // Response content
      var drinks = res.body;
      drinks.should.be.an.instanceOf(Array);
      drinks.length.should.be.above(0);

      // Contains inserted user
      var lastSleep = drinks[drinks.length-1];
      lastSleep.should.include({
        value: drinkCreated.value,
        author: {
          code: userCreated.code,
          email: userCreated.email,
          username: userCreated.username
        }
      });

      done();
    });
  });


  // GET /users/1/drinks/1

  it('should return the created drink', function(done) {
    request(url).get(drinkUrl).end(function(err, res) {
      if(err) throw err;

      UtilTest.jsonAndStatus(res, 200);

      // Response content
      var drink = res.body;
      drink.should.be.an.instanceOf(Object);

      // Contains correct keys and values
      drink.should.include({
        value: drinkCreated.value,
        author: {
          code: userCreated.code,
          email: userCreated.email,
          username: userCreated.username
        }
      });

      done();
    });
  });


  // DELETE /users/1/drinks/1 + /users/1

  it('should remove the user', function(done) {
    request(url).del(drinkUrl).end(function(err, res) {
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
