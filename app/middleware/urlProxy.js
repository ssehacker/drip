/**
 * Created by ssehacker on 2016/12/15.
 */
import UserDao from '../src/dao/UserDao';
import loadConfig from '../src/util/loadConfig';

const userDao = new UserDao();
const config = loadConfig();

const BINDING_HOST = config.host;
export default async (ctx, next) => {
  const currentHost = ctx.request.headers['x-request-host'];
  const USER_NAME = 'x-username';
  let url = ctx.originalUrl;

  console.log(`from: ${currentHost + url}`);
  if (!/^\/api/.test(url)) {
    await next();
    return;
  }

  const hostReg = `.${BINDING_HOST}$`.replace(/\./g, '\\.');
  const name = currentHost.replace(new RegExp(hostReg, 'g'), '');
  const blogger = await userDao.findOne({ $or: [
    {
      customDomain: currentHost,
    },
    {
      domain: name,
    },
  ] });

  // console.log(blogger)
  // 检查域名是否合法
  if (!blogger && currentHost !== BINDING_HOST) {
    ctx.status = 404;
    return;
  }

  if (url.indexOf(USER_NAME) > -1) {
    url = url.replace(USER_NAME, blogger.name);
  }

  ctx.request.url = url;

  await next();
};
