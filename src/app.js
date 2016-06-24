var express = require('express');
var middleware = require('./middleware');

var app = express();

app.get('/_ping', function(req, res){
  res.status(200).end();
});

app.use(function(req, res, next){
  middleware(req, res, next);
});

app.use(function(req, res){
  res.status(404).end();
});

app.use(function (err, req, res, next) { // eslint-disable-line no-unused-vars
  if (err.stack) process.stderr.write(err.stack);
  res.status(err.status || 500).end();
});

module.exports = app;
