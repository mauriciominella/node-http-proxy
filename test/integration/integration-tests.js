var assert = require('chai').assert;
var superagent = require('superagent');
var server = require('../../src/server');
var users = require('../../src/users');
var status = require('http-status');

describe('/mobile', function() {
  var app;

  before(function() {
    app = server(3000);
  });

  after(function() {
    app.close();
  });

  it('it returns mobile api when request to 9000/mobile', function(done){

    superagent.post('http://localhost:9000/mobile/authenticate')
      .send({username: 'admin', password: '1234'})
      .end(function(err, res) {
      testAuthenticatedUser(res.body.token);
    });

    function testAuthenticatedUser(token){
      superagent.post('http://localhost:9000/mobile')
        .send({token: token})
        .end(function(err, res) {
        assert.ifError(err);
        assert.equal(res.status, status.OK);
        assert.isTrue(res.text.indexOf('I am the mobile api') > -1);
        done();
      });
    }
  });

  it('it returns 403 code when the login is not provided', function(done){
    superagent.get('http://localhost:9000/mobile').end(function(err, res) {
      assert.equal(res.status, status.FORBIDDEN);
      done();
    });
  });

  /*it('returns username if name param is a valid user', function(done) {
    users.list = ['test'];
    superagent.get('http://localhost:8080/user/test').end(function(err, res) {
      assert.ifError(err);
      assert.equal(res.status, status.OK);
      var result = JSON.parse(res.text);
      assert.deepEqual({ user: 'test' }, result);
      done();
    });
  });

  it('returns 404 if user named `params.name` not found', function(done) {
    users.list = ['test'];
    superagent.get('http://localhost:8080/user/notfound').end(function(err, res) {
      assert.ifError(err);
      assert.equal(res.status, status.NOT_FOUND);
      var result = JSON.parse(res.text);
      assert.deepEqual({ error: 'Not Found' }, result);
      done();
    });
  });*/
});
