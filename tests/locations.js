var should = require('should')
  , assert = require('assert')
  , request = require('supertest')
  , chai = require('chai')
  , expect = chai.expect
  , UtilTest = require('../utils/tests')
  , LogsUtil = require('../utils/logs')

describe('LocationsController', function() {

  LogsUtil.greenLog("LocationsController...  4  tests")

  var url = 'http://localhost:3000'
    , accessToken = null
    , locationsUrl = null
    , locationUrl = null

  var userCreated = {
      username: 'John Doe'
    , password: 'password'
    , email: 'john.doe@email.com'
  }

  var locationCreated = {
      name: 'Home'
    , lat: '48.79534'
    , lng: '2.61545'
    , date: new Date()
  }

  // POST /users + POST /users/1/locations

  it('should create a new location', function(done) {
    request(url).post('/users').send(userCreated).end(function(err, res) {
      if(err) throw err

      // Fill user with new informations to access other routes
      var user = res.body

      // Add new element to user
      userCreated.access_token = user.access_token
      accessToken = '?access_token=' + userCreated.access_token
      userCreated.code = user.code
      locationsUrl = '/users/' + userCreated.code + '/locations'

      // POST /users/1/locations

      request(url)
        .post(locationsUrl + accessToken)
        .send(locationCreated)
        .end(function(err, res) {
          if(err) throw err

          UtilTest.jsonAndStatus(res, 201)

          // Fill user with new informations to access other routes
          location = res.body
          userCreated.locations = []
          userCreated.locations.push(location)
          locationUrl = locationsUrl + '/' + userCreated.locations[0].code + accessToken

          done()
        })
    })
  })


  // GET /users/1/locations

  it('should return the list of locations', function(done) {
    request(url).get(locationsUrl + accessToken).end(function(err, res) {
      if(err) throw err

      UtilTest.jsonAndStatus(res, 200)

      // Response content
      var locations = res.body
      locations.should.be.an.instanceOf(Array)
      locations.length.should.be.above(0)

      // Contains inserted user
      var lastLocation = locations[locations.length-1]
      lastLocation.should.include({
          value: locationCreated.value
        , author: {
              code: userCreated.code
            , email: userCreated.email
            , username: userCreated.username
          }
      })

      done()
    })
  })


  // GET /users/1/locations/1

  it('should return the created location', function(done) {
    request(url).get(locationUrl).end(function(err, res) {
      if(err) throw err

      UtilTest.jsonAndStatus(res, 200)

      // Response content
      var location = res.body
      location.should.be.an.instanceOf(Object)

      // Contains correct keys and values
      location.should.include({
          value: locationCreated.value
        , author: {
              code: userCreated.code
            , email: userCreated.email
            , username: userCreated.username
          }
      })

      done()
    })
  })


  // DELETE /users/1/locations/1 + /users/1

  it('should remove the user', function(done) {
    request(url).del(locationUrl).end(function(err, res) {
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
