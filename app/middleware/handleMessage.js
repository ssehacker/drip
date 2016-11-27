/**
 * Created by ssehacker on 16/7/9.
 */

import _ from 'underscore';

function handleMessage() {
  return async (ctx, next) => {
    ctx.success = (msg) => {
      ctx.body = _.extend({ code: 0, msg: '' }, msg);
      ctx.type = 'json';
    };
    ctx.error = (msg) => {
      ctx.body = _.extend({ code: -1, msg: 'Internal Server Error.' }, msg);
      ctx.type = 'json';
    };
    await next();
  };
}

export default handleMessage;
