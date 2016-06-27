import express from 'express';
// import config from './env/config';
// import etcd from './env/etcd';
import middleware from './middleware';
import rules from './rules';
// import etcdRules from './services/etcd-rules';

const app = express();


app.get('/_ping', (req, res) => {
  res.status(200).end();
});


// reading match-rules from a external file
{
  let mid = middleware();
  // const rules = JSON.parse(fs.readFileSync('rules.json', 'utf8'));
  mid = middleware(rules);
  /* etcdRules(etcd, config.etcd.key, (data) => {
    mid = middleware(data);
  });*/
  app.use((req, res, next) => mid(req, res, next));
}


app.use((req, res) => {
  res.status(404).end();
});


app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  if (err.stack) process.stderr.write(err.stack);
  res.status(err.status || 500).end();
});


export default app;
