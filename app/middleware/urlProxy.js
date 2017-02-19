/**
 * Created by ssehacker on 2016/12/15.
 */

const proxyList = [
  {
    host: 'zhouyong.1xue.me',
    username: 'zhouyong',
  },
];

export default async (ctx, next) => {
  console.log(ctx.host);
  console.log(ctx.hostname);
  await next();
};
