var should = require('should')
  , assert = require('assert')
  , request = require('supertest')
  , chai = require('chai')
  , expect = chai.expect
  , UtilTest = require('../utils/tests')
  , LogsUtil = require('../utils/logs')

describe('SportsController', function() {

  LogsUtil.greenLog("SportsController...     4  tests")

  var url = 'http://localhost:3000'
    , accessToken = null
    , sportsUrl = null
    , sportUrl = null

  var userCreated = {
      username: 'John Doe'
    , password: 'password'
    , email: 'john.doe@email.com'
  }

  var sportCreated = {
      type: 'Soccer'
    , duration: 60
    , date: new Date()
  }


  // POST /users + POST /users/1/sports

  it('should create a new sport', function(done) {
    request(url).post('/users').send(userCreated).end(function(err, res) {
      if(err) throw err

      // Fill user with new informations to access other routes
      var user = res.body

      // Add new element to user
      userCreated.access_token = user.access_token
      accessToken = '?access_token=' + userCreated.access_token
      userCreated.code = user.code
      sportsUrl = '/users/' + userCreated.code + '/sports'

      // POST /users/1/sports

      request(url)
        .post(sportsUrl + accessToken)
        .send(sportCreated)
        .end(function(err, res) {
          if(err) throw err

          UtilTest.jsonAndStatus(res, 201)

          // Fill user with new informations to access other routes
          sport = res.body
          userCreated.sports = []
          userCreated.sports.push(sport)
          sportUrl = sportsUrl + '/' + userCreated.sports[0].code + accessToken

          done()
        })
    })
  })


  // GET /users/1/sports

  it('should return the list of sports', function(done) {
    request(url).get(sportsUrl + accessToken).end(function(err, res) {
      if(err) throw err

      UtilTest.jsonAndStatus(res, 200)

      // Response content
      var sports = res.body
      sports.should.be.an.instanceOf(Array)
      sports.length.should.be.above(0)

      // Contains inserted user
      var lastSleep = sports[sports.length-1]
      lastSleep.should.include({
          value: sportCreated.value
        , author: {
              code: userCreated.code
            , email: userCreated.email
            , username: userCreated.username
          }
      })

      done()
    })
  })


  // GET /users/1/sports/1

  it('should return the created sport', function(done) {
    request(url).get(sportUrl).end(function(err, res) {
      if(err) throw err

      UtilTest.jsonAndStatus(res, 200)

      // Response content
      var sport = res.body
      sport.should.be.an.instanceOf(Object)

      // Contains correct keys and values
      sport.should.include({
          value: sportCreated.value
        , author: {
              code: userCreated.code
            , email: userCreated.email
            , username: userCreated.username
          }
      })

      done()
    })
  })


  // DELETE /users/1/sports/1 + /users/1

  it('should remove the user', function(done) {
    request(url).del(sportUrl).end(function(err, res) {
      if(err) throw err

      UtilTest.jsonAndStatus(res, 200)

      // Response content
      var result = res.body
      result.should.be.an.instanceOf(Object)

      // Gives status
      result.should.include({
        result: 'deleted'
      })

      request(url).del('/users/' + userCreated.code + accessToken).end(function(err, res) {
        if(err) throw err
        done()
      })
    })
  })

})