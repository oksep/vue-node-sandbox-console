import './utils/log';
import AppConfig from './config';

import http from 'http';
import path from 'path';
import koa from 'koa';
import cors from 'koa2-cors';
import logger from 'koa-logger';
import bodyParser from 'koa-bodyparser';
import koastatic from 'koa-static';
import router from './routes/index';

const app = new koa();
app.use(cors({ credentials: true }));
app.use(logger());
app.use(koastatic(path.join(__dirname, './static'), { maxage: 100000 }));
app.use(bodyParser());

if (AppConfig.IS_DEV) {
  // logger
  app.use(async (ctx, next) => {
    const start: number = new Date().getSeconds();
    await next();
    const ms = new Date().getSeconds() - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
    console.log(ctx.request.body);
  });
}

app.use(router.routes()).use(router.allowedMethods());

// 404
app.use(async (ctx) => {
  ctx.status = 404;
  ctx.body = {
    code: 404,
    msg: '404 Not Found',
  };
});

// error logger
app.on('error', async (err, ctx) => {
  console.log('error occured:', err);
});

const port = parseInt(AppConfig.SERVER_PORT || '8088');
const server = http.createServer(app.callback());

server.listen(port);
server.on('error', (error: { syscall: string, code: string }) => {
  if (error.syscall !== 'listen') {
    console.log(JSON.stringify(error, null, 2));
  }
  switch (error.code) {
    case 'EACCES':
      console.error(port + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(port + ' is already in use');
      process.exit(1);
      break;
    default:
      console.log(JSON.stringify(error, null, 2));
  }
});
server.on('listening', () => {
  console.log('Listening on port: %d', port);
});
process.on('uncaughtException', function(err) {
  console.log(JSON.stringify(err, null, 2));
});
