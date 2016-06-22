var http = require('http'),
    httpProxy = require('http-proxy'),
    HttpProxyRules = require('http-proxy-rules'),
    mobileServer = require('./mobile-server');


var createServer = function(port) {
  // Set up proxy rules instance
  var proxyRules = new HttpProxyRules({
    rules: {
      '.*/mobile': 'http://localhost:8080/',
      '.*/cupom': 'http://localhost:8081/',
      '.*/fluxo': 'http://localhost:8082/',
    },
    default: 'http://localhost:8080' // default target
  });

  // Create reverse proxy instance
  var proxy = httpProxy.createProxy();


  proxy.on('proxyReq', function (proxyReq, req, res) {

  });

  // Create http server that leverages reverse proxy instance
  // and proxy rules to proxy requests to different targets
  var app = http.createServer(function(req, res) {

    // a match method is exposed on the proxy rules instance
    // to test a request to see if it matches against one of the specified rules
    var target = proxyRules.match(req);
    if (target) {
      return proxy.web(req, res, {
        target: target
      });
    }

    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('The request url and path did not match any of the listed rules!');
  }).listen(9000, function(){
    console.log("proxy listening...")
  });

  //
  // Create your target server
  //
  /*http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write('I am the mobile api!' + '\n' + JSON.stringify(req.headers, true, 2));
    res.end();
  }).listen(8080);*/

  mobileServer();

  http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write('I am the cupom api!' + '\n' + JSON.stringify(req.headers, true, 2));
    res.end();
  }).listen(8081);

  http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write('I am the fluxo api!' + '\n' + JSON.stringify(req.headers, true, 2));
    res.end();
  }).listen(8082);

  return app
};

module.exports = createServer;
