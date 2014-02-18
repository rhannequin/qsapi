var should = require('should')
  , assert = require('assert')
  , request = require('supertest')
  , chai = require('chai')
  , expect = chai.expect
  , UtilTest = require('../utils/tests')
  , LogsUtil = require('../utils/logs')

describe('SleepsController', function() {

  LogsUtil.greenLog("SleepsController...     4  tests")

  var url = 'http://localhost:3000'
    , accessToken = null
    , sleepsUrl = null
    , sleepUrl = null

  var userCreated = {
      username: 'John Doe'
    , password: 'password'
    , email: 'john.doe@email.com'
  }

  var sleepCreated = (function(){
    var now = new Date()
    var start = new Date(now)
    var end = new Date(now)
    start.setHours(22)
    end.setHours(22 + 8)
    return {
        start: start
      , end: end
    }
  })()


  // POST /users + POST /users/1/sleeps

  it('should create a new sleep', function(done) {
    request(url).post('/users').send(userCreated).end(function(err, res) {
      if(err) throw err

      // Fill user with new informations to access other routes
      var user = res.body

      // Add new element to user
      userCreated.access_token = user.access_token
      accessToken = '?access_token=' + userCreated.access_token
      userCreated.code = user.code
      sleepsUrl = '/users/' + userCreated.code + '/sleeps'

      // POST /users/1/sleeps

      request(url)
        .post(sleepsUrl + accessToken)
        .send(sleepCreated)
        .end(function(err, res) {
          if(err) throw err

          UtilTest.jsonAndStatus(res, 201)

          // Fill user with new informations to access other routes
          sleep = res.body
          userCreated.sleeps = []
          userCreated.sleeps.push(sleep)
          sleepUrl = sleepsUrl + '/' + userCreated.sleeps[0].code + accessToken

          done()
        })
    })
  })


  // GET /users/1/sleeps

  it('should return the list of sleeps', function(done) {
    request(url).get(sleepsUrl + accessToken).end(function(err, res) {
      if(err) throw err

      UtilTest.jsonAndStatus(res, 200)

      // Response content
      var sleeps = res.body
      sleeps.should.be.an.instanceOf(Array)
      sleeps.length.should.be.above(0)

      // Contains inserted user
      var lastSleep = sleeps[sleeps.length-1]
      lastSleep.should.include({
          value: sleepCreated.value
        , author: {
              code: userCreated.code
            , email: userCreated.email
            , username: userCreated.username
          }
      })

      done()
    })
  })


  // GET /users/1/sleeps/1

  it('should return the created sleep', function(done) {
    request(url).get(sleepUrl).end(function(err, res) {
      if(err) throw err

      UtilTest.jsonAndStatus(res, 200)

      // Response content
      var sleep = res.body
      sleep.should.be.an.instanceOf(Object)

      // Contains correct keys and values
      sleep.should.include({
          value: sleepCreated.value
        , author: {
              code: userCreated.code
            , email: userCreated.email
            , username: userCreated.username
          }
      })

      done()
    })
  })


  // DELETE /users/1/sleeps/1 + /users/1

  it('should remove the user', function(done) {
    request(url).del(sleepUrl).end(function(err, res) {
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
