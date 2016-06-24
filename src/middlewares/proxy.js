var httpProxy = require('http-proxy');
var httpProxyRules = require('http-proxy-rules');
var url = require('url');

var proxyEngine = httpProxy.createProxyServer({
  xfwd: true,
});

module.exports = function(req, res, next){

    // Set up proxy rules instance
    var proxyRules = new httpProxyRules({
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

    var target = proxyRules.match(req);
    if (target) {
      return proxy.web(req, res, {
        target: target
      });
    };

    next();
}
