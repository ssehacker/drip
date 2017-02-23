/**
 * Created by ssehacker on 2016/12/15.
 */

const hosts = [
  {
    host: 'zhouyong.1xue.me',
    customHost: 'zhouyongblog.com',
    username: 'zhouyong',
  },
];

const BINDING_HOST = '1xue.me';
export default async (ctx, next) => {
  const currentHost = ctx.request.headers['x-request-host'];
  const USER_NAME = 'x-username';

  console.log(currentHost);
  // 检查域名是否合法
  const blogger = hosts.find(item => (item.host === currentHost
  || item.customHost === currentHost));

  if (!blogger && currentHost !== BINDING_HOST) {
    ctx.status = 404;
    return;
  }

  let url = ctx.originalUrl;
  if (url.indexOf(USER_NAME) > -1) {
    url = url.replace(USER_NAME, blogger.username);
  }

  ctx.request.url = url;

  await next();
};
