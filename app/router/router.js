import koaRouter from 'koa-router';
import log4js from 'log4js';
import loadConfig from '../src/util/loadConfig';

const logger = log4js.getLogger('runtime');
const config = loadConfig();

const router = koaRouter();
router.get('/', async (ctx) => {
  await ctx.render('index.jade', {
    host: config.cdn,
  });
});

router.get('/admin', async (ctx) => {
  logger.info('ctx.session.username===', ctx.session.username);
  if (!ctx.session.username) {
    ctx.redirect('/');
  }
  await ctx.render('admin.jade', {
    host: config.cdn,
  });
});

router.get('/:userid', async (ctx) => {
  // console.log('ctx.params.userid==', ctx.params.userid);
  await ctx.render('theme.jade', {
    host: config.cdn,
  });
});

export default router;
