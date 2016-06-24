
import httpProxy from 'http-proxy';
import HttpProxyRules from 'http-proxy-rules';
// import url from 'url';

export default () => {
  return (req, res, next) => {
      // Set up proxy rules instance
    const proxyRules = new HttpProxyRules({
      rules: {
        '.*/mobile/authenticate': 'http://localhost:8080/api/authenticate',
        '.*/mobile': 'http://localhost:8080/api/mobile',
        '.*/cupom': 'http://localhost:8081/',
        '.*/fluxo': 'http://localhost:8082/',
      },
      default: 'http://localhost:8080'
    });

    // Create reverse proxy instance
    const proxy = httpProxy.createProxy();

    const target = proxyRules.match(req);
    if (target) {
      return proxy.web(req, res, {
        target
      });
    }

    next();
    return {};
  }
}
