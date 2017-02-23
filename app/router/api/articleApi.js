/**
 * Created by ssehacker on 2016/11/26.
 */
// import log4js from 'log4js';
import koaRouter from 'koa-router';
import loadMarkdown from 'markdown-it';
import hljs from 'highlight.js';
import UserDao from '../../src/dao/UserDao';
import ArticleDao from '../../src/dao/ArticleDao';
import Status from '../../src/Status';

const router = koaRouter();
// const logger = log4js.getLogger('runtime');
const userDao = new UserDao();
const articleDao = new ArticleDao();
const md = loadMarkdown({
  highlight: (str, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value;
      } catch (e) {
        console.error(e);
      }
    }
    return ''; // use external default escaping
  },
  breaks: true,
});

function isQueryBodyNull(ctx) {
  if (!ctx.request.body) {
    ctx.error({
      msg: 'Request body should not be null!',
    });
  }
}

/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }]*/
router.post('/api/article', async (ctx) => {
  if (!ctx.session.username) {
    ctx.error(Status.USER_AUTH_FAILED);
    return;
  }
  const user = await userDao.findOne({
    name: ctx.session.username,
  });
  if (!user) {
    ctx.error(Status.USER_AUTH_FAILED);
    return;
  }

  if (isQueryBodyNull(ctx)) {
    return;
  }
  const body = ctx.request.body;
  const title = body.title;
  const markdown = body.content;
  const content = md.render(markdown);
  const viewCount = 0;
  const tags = body.tags || [];

  await articleDao.insert({
    title,
    content,
    markdown,
    viewCount,
    tags,
    createDate: Date.now(),
    lastUpdate: Date.now(),
    user: user._id,
  });

  ctx.success();
});

// todo 只允许删除username 为自己的, mongoose join !!!important!!!!!
// 需要权限
router.delete('/api/article/:id', async (ctx) => {
  // let username = ctx.session.username;
  const id = ctx.params.id;
  await articleDao.remove({
    _id: id,
  });
  // console.log('res.result.ok===', res.result.ok);
  ctx.success();
});

// 需要权限
router.put('/api/article/:id', async (ctx) => {
  // let username = ctx.session.username;
  const id = ctx.params.id;
  const body = ctx.request.body;
  const title = body.title;
  const markdown = body.content;
  const content = md.render(markdown);

  await articleDao.update({
    // name: username,
    _id: id,
  }, {
    $set: {
      lastUpdate: Date.now(),
      title,
      markdown,
      content,
    },
  });
  // console.log('res==', res);
  ctx.success();
});

// 需要权限
router.get('/api/article', async (ctx, next) => {
  const username = ctx.session.username;
  ctx.query.username = username;
  ctx.url = ctx.url.replace(/^\/api/, `/api/${username}`);

  // mock delay
  //  util.sleep(4000);
  await next();
  // ctx.redirect(newUrl);
});

export default router;
