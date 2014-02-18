var should = require('should')
  , assert = require('assert')
  , request = require('supertest')
  , chai = require('chai')
  , expect = chai.expect
  , UtilTest = require('../utils/tests')
  , LogsUtil = require('../utils/logs')

describe('UsersController', function() {

  LogsUtil.greenLog("UsersController...      8  tests")

  var url = 'http://localhost:3000'
    , accessToken = null

  var userCreated = {
      username: 'John Doe'
    , password: 'password'
    , email: 'john.doe@email.com'
  }

  var modify = {
    username: 'Jane Doe'
  }


  // POST /users

  it('should create a new user', function(done) {
    request(url)
      .post('/users')
      .send(userCreated)
      .end(function(err, res) {
        if(err) throw err

        UtilTest.jsonAndStatus(res, 201)

        // Fill user with new informations to access other routes
        var user = res.body

        // Required params returned
        user.should.have.properties(['code', 'username', 'email'])

        // Check if the values are correct
        user.username.should.equal(userCreated.username)
        user.email.should.equal(userCreated.email)

        // Add new element to user
        userCreated.access_token = user.access_token
        accessToken = '?access_token=' + userCreated.access_token
        userCreated.code = user.code

        done()
      })
  })

  it('should not create a new user', function(done) {
    request(url)
      .post('/users')
      .send(userCreated)
      .end(function(err, res) {
        if(err) throw err
        UtilTest.jsonAndStatus(res, 409)
        done()
      })
  })



  // GET /users/1

  it('should return the user', function(done) {
    request(url)
      .get('/users/' + userCreated.code + accessToken)
      .end(function(err, res) {
        if(err) throw err

        UtilTest.jsonAndStatus(res, 200)

        // Response content
        var user = res.body
        user.should.be.an.instanceOf(Object)

        // Contains correct keys and values
        user.should.include(userCreated)

        done()
      })
  })

  UtilTest.notAvailable(url, 'get', '/users/' + userCreated.code)


  // PUT /users/1

  it('should update the user', function(done) {

    request(url)
      .put('/users/' + userCreated.code + accessToken)
      .send(modify)
      .end(function(err, res) {
        if(err) throw err

        UtilTest.jsonAndStatus(res, 200)

        // Response content
        var user = res.body
        user.should.be.an.instanceOf(Object)

        // Contains correct keys and values
        user.should.include({
            username: modify.username
          , email: userCreated.email
          , code: userCreated.code
        })

        done()
      })
  })

  UtilTest.notAvailable(url, 'put', '/users/' + userCreated.code)


  // DELETE /users/1

  it('should remove the user', function(done) {
    request(url)
      .del('/users/' + userCreated.code + accessToken)
      .end(function(err, res) {
        if(err) throw err

        UtilTest.jsonAndStatus(res, 200)

        // Response content
        var result = res.body
        result.should.be.an.instanceOf(Object)

        // Gives status
        result.should.include({
          result: 'deleted'
        })

        done()
      })
  })

  UtilTest.notAvailable(url, 'del', '/users/' + userCreated.code)

})

