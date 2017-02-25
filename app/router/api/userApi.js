/**
 * Created by ssehacker on 2016/11/26.
 */
import loadMarkdowm from 'markdown-it';
import log4js from 'log4js';
import hljs from 'highlight.js';
import koaRouter from 'koa-router';
import UserDao from '../../src/dao/UserDao';
import Status from '../../src/Status';
import loadConfig from '../../src/util/loadConfig';
import util from '../../src/util/util';

const router = koaRouter();
const logger = log4js.getLogger('runtime');
const userDao = new UserDao();
const md = loadMarkdowm({
  highlight: (str, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value;
      } catch (e) {
        logger.error(e);
      }
    }

    return ''; // use external default escaping
  },
  breaks: true,
});
const config = loadConfig();

function activeUser(ctx, username) {
  ctx.session.username = username;
}

// todo: username should be email.
function validateUser(username, password) {
  if (username && password && password.length >= 6) {
    return true;
  }
  return false;
}

// 新增用户
router.post('/api/user', async (ctx) => {
  const body = ctx.request.body;
  const username = body.username;
  const domain = username && username.toLowerCase();

  // console.log('domain', domain);
  const password = body.password;
  const photo = `${config.cdn}/photos/default-photo.jpeg`;

  if (!validateUser(username, password)) {
    ctx.error(Status.USER_VALIDATE_ERROR);
    return;
  }

  const isExist = await userDao.findOne({ name: username });
  if (isExist) {
    ctx.error(Status.USER_EXIST);
    return;
  }

  try {
    await userDao.insert({
      name: username,
      nick: username,
      password: util.encrypt(password),
      photo,
      domain,
      createDate: Date.now(),
      lastUpdate: Date.now(),
    });
    activeUser(ctx, username);
    ctx.success();
  } catch (e) {
    logger.error(e);
    ctx.error(e);
  }
});

// 需要权限
router.put('/api/user', async (ctx) => {
  const body = ctx.request.body;
  const username = body.name;
  const nick = body.nick;
  const customDomain = body.customDomain;
  const desc = body.desc;
  // let res;

  if (username && username === ctx.session.username) {
    await userDao.update({ name: username }, {
      $set: {
        nick,
        customDomain,
        desc,
        lastUpdate: Date.now(),
      },
    });
    ctx.success();
  } else {
    ctx.error(Status.USER_FORBID);
  }
});

// 需要权限
router.patch('/api/user', async (ctx) => {
  const name = ctx.session.username;
  // console.log('name===',name);
  const body = ctx.request.body;
  const fields = ['resumeMD', 'contactMD'];

  const fieldName = body.fieldName;
  const fieldValue = body.fieldValue;

  if (fields.indexOf(fieldName) === -1) {
    ctx.error(Status.PARAMS_ERROR);
    return;
  }

  try {
    const fieldValueHtml = md.render(fieldValue);
    await userDao.update({ name }, {
      $set: {
        [`${fieldName}`]: fieldValue,
        [`${fieldName.replace('MD', '')}`]: fieldValueHtml,
        lastUpdate: Date.now(),
      },
    });
    ctx.success();
  } catch (err) {
    ctx.error({ msg: err });
  }
});

// 需要权限
router.get('/api/user', async (ctx) => {
  const username = ctx.session.username;
  const user = await userDao.findOne({ name: username },
    {
      name: true,
      nick: true,
      photo: true,
      resume: true,
      resumeMD: true,
      contact: true,
      contactMD: true,
      desc: true,
      domain: true,
      customDomain: true,
    },
  );
  ctx.success({
    data: user,
  });
});

export default router;
