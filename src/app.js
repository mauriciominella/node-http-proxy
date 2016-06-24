// import express from 'express';
// import middleware from './middleware';
//
// const app = express();
//
// app.get('/_ping', (req, res) => {
//   res.status(200).end();
// });
//
// app.use((req, res, next) => {
//   middleware(req, res, next);
// });
//
// app.use((req, res) => {
//   res.status(404).end();
// });
//
// app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
//   if (err.stack) process.stderr.write(err.stack);
//   res.status(err.status || 500).end();
// });
//
// module.exports = app;
