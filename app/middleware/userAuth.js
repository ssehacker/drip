/**
 * Created by ssehacker on 16/9/2.
 */
import _ from 'underscore';
import Status from '../src/Status';

// 以下请求需要登录才能访问
const requestsNeedAuth = [
  {
    path: '/api/article/:id',
    method: 'DELETE',
  },
  {
    path: '/api/article/:id',
    method: 'PUT',
  },
  {
    path: '/api/user',
    method: 'PUT',
  },
  {
    path: '/api/user',
    method: 'PATCH',
  },
  {
    path: '/api/user',
    method: 'GET',
  },
  {
    path: '/api/logout',
    method: 'POST',
  },
];

function match(path, method) {
  return _.find(requestsNeedAuth, item => (item.path === path && item.method === method));
}

export default async function (ctx, next) {
  console.log(ctx.method, ctx.path);
  if (match(ctx.path, ctx.method) && !ctx.session.username) {
    ctx.error(Status.USER_AUTH_FAILED);
    return;
  }
  await next();
}
