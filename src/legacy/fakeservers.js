import http from 'http';
import mobileServer from './mobile-server';

mobileServer(8080);

http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write('I am the cupom api!' + '\n' + JSON.stringify(req.headers, true, 2));
  res.end();
}).listen(8081);

http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write('I am the fluxo api!' + '\n' + JSON.stringify(req.headers, true, 2));
  res.end();
}).listen(8082);
