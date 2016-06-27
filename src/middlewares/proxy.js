//
// import httpProxy from 'http-proxy';
// import HttpProxyRules from 'http-proxy-rules';
// // import url from 'url';
//
// export default () => {
//   return (req, res, next) => {
//       // Set up proxy rules instance
//     const proxyRules = new HttpProxyRules({
//       rules: {
//         '.*/mobile/authenticate': 'http://localhost:8080/api/authenticate',
//         '.*/mobile': 'http://localhost:8080/api/mobile',
//         '.*/cupom': 'http://localhost:8081/',
//         '.*/fluxo': 'http://localhost:8082/',
//       },
//       default: 'http://localhost:8080'
//     });
//
//     // Create reverse proxy instance
//     const proxy = httpProxy.createProxy();
//
//     const target = proxyRules.match(req);
//     if (target) {
//       return proxy.web(req, res, {
//         target
//       });
//     }
//
//     next();
//     return {};
//   }
// }


import httpProxy from 'http-proxy';
import url from 'url';


// const buildDebug = require('../env/correlation-debug')('middlewares:proxy');


const proxyEngine = httpProxy.createProxyServer({
  xfwd: true,
});


export default () => {
  return (req, res, next) => {
    const { proxy = {}, matches } = req.proxyRule;

    if (!proxy.enabled) return next();

    const { target } = proxy;

    const srcUrl = url.parse(req.url || '/');
    const destUrl = url.parse(target);

    if (matches && matches.path) {
      req.url = replace(matches.path, srcUrl.path, destUrl.path);
    }

    const finalTargetUrl = url.format({
      protocol: destUrl.protocol,
      slashes: destUrl.slashes,
      auth: destUrl.auth,
      host: destUrl.host,
    });

    // const debug = buildDebug(req.headers['x-request-id']);
    // debug('proxy from %s to %s', req.url, finalTargetUrl);

    proxyEngine.web(req, res, { ...proxy, target: finalTargetUrl }, (err) => {
      console.error(err); // eslint-disable-line no-console
      res.status(500).end();
    });
  };
};


function replace (re, src, dest) {
  if (!re) return src;

  const groups = re.exec(src);

  return `${dest}/${groups && groups[1] ? groups[1] : ''}`;
}
