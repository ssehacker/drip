import koaRouter from 'koa-router';
// import log4js from 'log4js';

import ArticleDao from '../src/dao/ArticleDao';
import UserDao from '../src/dao/UserDao';
import Status from '../src/Status';
import userAuth from '../middleware/userAuth';
import userApi from './api/userApi';
import articleApi from './api/articleApi';
import uploadFile from './api/uploadFile';
import loadConfig from '../src/util/loadConfig';
// import urlProxy from '../middleware/urlProxy';

const router = koaRouter();
// const logger = log4js.getLogger('runtime');
const config = loadConfig();


const articleDao = new ArticleDao();
const userDao = new UserDao();

// router.use('/', urlProxy);
router.use('/api', userAuth);

router.get('/api/article', async (ctx) => {
  const maxPageSize = 30;
  const defaultPageSize = 10;

  const query = ctx.request.query;

  const username = query.username;
  // console.log('username==', username);

  const user = await userDao.findOne({
    domain: username.toLowerCase(),
  });

  // pageSize
  let pageSize = parseInt(query.pageSize, 10) || defaultPageSize;


  if (pageSize > maxPageSize || pageSize < 5) {
    pageSize = defaultPageSize;
  }

  // currentPage
  const currentPage = parseInt(query.currentPage, 10) || 1;
  const totalCount = await articleDao.count({
    user: {
      _id: user._id,
    },
  });

  const pageCount = Math.ceil(totalCount / pageSize);
  if (currentPage < 1 || currentPage > pageCount) {
    ctx.success({
      articles: [],
      pageCount,
      currentPage,
      pageSize,
    });
    return;
  }

  /* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }]*/
  const articles = await articleDao.find({ user: user._id }, {}, {
    limit: pageSize,
    skip: pageSize * (currentPage - 1),
    sort: {
      createDate: -1,
    },
  });

  const defaultUri = `${config.cdn}/public/noimage.gif`;

  articles.forEach((article) => {
    const regRes = article.content.match(/<img.*?src="(.*?\/\/.+\.(gif|png|jpe?g|svg).*?)".*?>/);

    article.preImg = (regRes && regRes[1]) || defaultUri;
  });
  ctx.success({
    articles,
    pageCount,
    currentPage,
    pageSize,
  });
});

router.get('/api/article/:id', async (ctx) => {
  // const username = ctx.params.userToken;
  const id = ctx.params.id;
  await articleDao.update({ _id: id }, {
    $inc: {
      viewCount: 1,
    },
  });
  const article = await articleDao.findOne({ _id: id });
  ctx.success({ article });
});

router.get('/api/users/:username', async (ctx) => {
  const username = ctx.params.username;
  const user = await userDao.findOne({
    domain: username.toLowerCase(),
  }, {
    nick: true,
    photo: true,
    resume: true,
    resumeMD: true,
    contact: true,
    contactMD: true,
    desc: true,
  });
  ctx.success({ user });
});

function activeUser(ctx, username) {
  ctx.session.username = username;
}

router.post('/api/login', async (ctx) => {
  const body = ctx.request.body;
  const username = body.username;
  const password = body.password;

  const isLegal = await userDao.checkUser(username, password);

  if (!isLegal) {
    ctx.error(Status.AUTH_FAILED);
    return;
  }

  activeUser(ctx, username);
  ctx.success();
});

// 需要权限
router.post('/api/logout', async (ctx) => {
  ctx.session.username = undefined;
  delete ctx.session.username;
  ctx.success();
});

router.use('', userApi.routes());
router.use('', articleApi.routes());
router.use('', uploadFile.routes());

module.exports = router;
