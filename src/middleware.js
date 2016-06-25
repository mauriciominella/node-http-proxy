import { Router } from 'express';
import matchRules from './middlewares/match-rules';
import proxy from './middlewares/proxy';

// const buildDebug = require('./env/correlation-debug')('middleware');


export default function handler (options = {}) {
  const router = Router(); // eslint-disable-line new-cap

  // router.use(require('./middlewares/request-id')(options));
  /* router.use((req, res, next) => {
    const debug = buildDebug(req.headers['x-request-id']);
    debug(`request ${req.headers.host}${req.url}`);
    next();
  });*/

  router.use(matchRules(options));
  // router.use(require('./middlewares/password')(options));
  // router.use(require('./middlewares/oauth2')(options));
  // router.use(require('./middlewares/login')(options));
  // router.use(require('./middlewares/headers')(options));
  router.use(proxy(options));

  return router;
}
