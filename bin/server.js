import Koa from 'koa';
import path from 'path';
import log4js from 'log4js';
import koaBody from 'koa-body';
import session from 'koa-session';
import convert from 'koa-convert';
import views from 'koa-views';
import serve from 'koa-static';
import handleMessage from '../app/middleware/handleMessage';
import router from '../app/router/router';

const app = new Koa();
log4js.loadAppender('file');
log4js.addAppender(log4js.appenders.file('logs/runtime.log'), 'runtime');
const logger = log4js.getLogger('runtime');


app.use(koaBody({
  formidable: {
    maxFieldsSize: 10 * 1024 * 1024,
  },
}));

app.keys = ['secret', 'key'];

app.use(convert(session(app)));

app.use(handleMessage());

// 异常处理, 必须放在所有中间件的最前面
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = err.message;
    logger.error(err);
  }
});


app.use(views(path.resolve(__dirname, '../app/views'), {
  extension: 'jade',
  pretty: true, // not work?? why???
  map: {
    jade: 'jade',
  },
}));

app.use(serve(path.resolve('uploads')));

// koa v2
// responseTime
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
  logger.info(`X-Response-Time: ${ms} ms`);
});

app.use(require('../app/router/api.js').routes());

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(9090);

