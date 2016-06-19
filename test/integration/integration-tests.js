var assert = require('chai').assert;
var superagent = require('superagent');
var server = require('../../server');
var users = require('../../users');
var status = require('http-status');

describe('/mobile', function() {
  var app;

  before(function() {
    app = server(3000);
  });

  after(function() {
    app.close();
  });

  it('returns mobile api when requests to 9000/mobile', function(done){
    superagent.get('http://localhost:9000/mobile').end(function(err, res) {
      assert.ifError(err);
      assert.equal(res.status, status.OK);
      //var result = JSON.parse(res.text);
      //assert.deepEqual({ user: 'test' }, result);
      assert.isTrue(res.text.indexOf('I am the mobile api') > -1);
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
