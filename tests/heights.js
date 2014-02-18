var should = require('should')
  , assert = require('assert')
  , request = require('supertest')
  , chai = require('chai')
  , expect = chai.expect
  , UtilTest = require('../utils/tests')
  , LogsUtil = require('../utils/logs')

describe('HeightsController', function() {

  LogsUtil.greenLog("HeightsController...    4  tests")

  var url = 'http://localhost:3000'
    , accessToken = null
    , heightsUrl = null
    , heightUrl = null

  var userCreated = {
      username: 'John Doe'
    , password: 'password'
    , email: 'john.doe@email.com'
  }

  var heightCreated = {
      unit: 'cm'
    , value: 175
    , date: new Date()
  }


  // POST /users + POST /users/1/heights

  it('should create a new height', function(done) {
    request(url).post('/users').send(userCreated).end(function(err, res) {
      if(err) throw err

      // Fill user with new informations to access other routes
      var user = res.body

      // Add new element to user
      userCreated.access_token = user.access_token
      accessToken = '?access_token=' + userCreated.access_token
      userCreated.code = user.code
      heightsUrl = '/users/' + userCreated.code + '/heights'

      // POST /users/1/heights

      request(url)
        .post(heightsUrl + accessToken)
        .send(heightCreated)
        .end(function(err, res) {
          if(err) throw err

          UtilTest.jsonAndStatus(res, 201)

          // Fill user with new informations to access other routes
          height = res.body
          userCreated.heights = []
          userCreated.heights.push(height)
          heightUrl = heightsUrl + '/' + userCreated.heights[0].code + accessToken

          done()
        })
    })
  })


  // GET /users/1/heights

  it('should return the list of heights', function(done) {
    request(url).get(heightsUrl + accessToken).end(function(err, res) {
      if(err) throw err

      UtilTest.jsonAndStatus(res, 200)

      // Response content
      var heights = res.body
      heights.should.be.an.instanceOf(Array)
      heights.length.should.be.above(0)

      // Contains inserted user
      var lastHeight = heights[heights.length-1]
      lastHeight.should.include({
          value: heightCreated.value
        , author: {
              code: userCreated.code
            , email: userCreated.email
            , username: userCreated.username
          }
      })

      done()
    })
  })


  // GET /users/1/heights/1

  it('should return the created height', function(done) {
    request(url).get(heightUrl).end(function(err, res) {
      if(err) throw err

      UtilTest.jsonAndStatus(res, 200)

      // Response content
      var height = res.body
      height.should.be.an.instanceOf(Object)

      // Contains correct keys and values
      height.should.include({
          value: heightCreated.value
        , author: {
              code: userCreated.code
            , email: userCreated.email
            , username: userCreated.username
          }
      })

      done()
    })
  })


  // DELETE /users/1/heights/1 + /users/1

  it('should remove the user', function(done) {
    request(url).del(heightUrl).end(function(err, res) {
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
