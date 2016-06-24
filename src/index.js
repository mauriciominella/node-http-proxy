import matchRules from './middlewares/match-rules';
import proxy from './middlewares/proxy';
import express from 'express';

function application () {
  const app = express();

  app.use(matchRules());
  app.use(proxy());
  return app;
}

export function start () {
  const app = application();

  app.listen(9000, () => {
    console.log('listening...');
  });
}
