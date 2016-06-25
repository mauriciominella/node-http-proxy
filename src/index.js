import app from './app';

export function start () {
  app.listen(9000, () => {
    console.log('listening...');
  });
}
