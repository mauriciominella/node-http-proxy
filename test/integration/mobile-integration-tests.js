var assert = require('chai').assert;
var superagent = require('superagent');

var users = require('../../src/users');
var status = require('http-status');
var config = require('../../src/config')
var proxybaseURL = 'http://localhost:' + config.PROXY_PORT;

describe('/mobile', function() {
  var app;
  var server;

  before(function() {
    server = require('../../src/server', {bustCache: true});
    app = server(config.PROXY_PORT);
  });

  after(function() {
    app.close();
  });

  it('it authenticates and returns 200 when the user and pass are correct ', function(done){
    superagent.post(proxybaseURL + '/mobile/authenticate')
      .send({username: 'admin', password: '1234'})
      .end(function(err, res) {
        assert.equal(res.status, status.OK);
        testAuthenticatedUser(res.body.token);
    });

    function testAuthenticatedUser(token){
      superagent.get(proxybaseURL + '/mobile')
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
    superagent.get(proxybaseURL + '/mobile').end(function(err, res) {
      assert.equal(res.status, status.FORBIDDEN);
      done();
    });
  });

  it('it contains the special header injected by the proxy', function(done){
    superagent.post(proxybaseURL + '/mobile/authenticate')
      .send({username: 'admin', password: '1234'})
      .end(function(err, res) {
        testAuthenticatedUser(res.body.token);
    });

    function testAuthenticatedUser(token){
      superagent.get(proxybaseURL + '/mobile')
        .send({token: token})
        .end(function(err, res) {
        assert.equal(res.headers['x-special-proxy-header'], 'foobar');
        done();
      });
    }
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
