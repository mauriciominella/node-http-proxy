var http = require('http'),
    express = require('express')
    httpProxy = require('http-proxy'),
    HttpProxyRules = require('http-proxy-rules'),
    mobileServer = require('./mobile-server');

var config = require('./config');

var createServer = function(port) {
  // Set up proxy rules instance
  var proxyRules = new HttpProxyRules({
    rules: {
      '.*/mobile/authenticate': 'http://localhost:8080/api/authenticate',
      '.*/mobile': 'http://localhost:8080/api/mobile',
      '.*/cupom': 'http://localhost:8081/',
      '.*/fluxo': 'http://localhost:8082/',
    },
    default: 'http://localhost:8080' // default target
  });

  // Create reverse proxy instance
  var proxy = httpProxy.createProxy();


  proxy.on('proxyReq', function(proxyReq, req, res, options) {
    /* CHANGING THE HEADER BEFORE REACHING THE TARGET API */
    proxyReq.setHeader('X-Special-Proxy-Header', 'foobar');
  });

  proxy.on('proxyRes', function(proxyRes, req, res, options) {
    /* It seems we are not able to change anything on both request and response */
    //console.log('RAW Response from the target', JSON.stringify(proxyRes.headers, true, 2));
  });


  // Create http server that leverages reverse proxy instance
  // and proxy rules to proxy requests to different targets
  var app = http.createServer(function(req, res) {

     /* CHANGING THE HEADER BEFORE RESPONDING THE REQUEST */
     res.oldWriteHead = res.writeHead;
     res.writeHead = function(statusCode, headers) {
       /* add logic to change headers here */
       var contentType = res.getHeader('content-type');
       res.setHeader('X-Special-Proxy-Header', 'foobar');
       res.oldWriteHead(statusCode, headers);
     }

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
  }).listen(config.PROXY_PORT, function(){
    console.log("proxy listening...")
  });



  /***************** TESTING SERVERS. NOTHING TO DO WITH THE PROXY ****************************************/
  mobileServer(8080);

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
