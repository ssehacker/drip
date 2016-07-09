/**
 * Created by ssehacker on 16/7/9.
 */

import _ from 'underscore';

function handleMessage (){

    return async function (ctx, next) {
        ctx.success = function (msg){
            ctx.body = _.extend({code: 0, msg: ''}, msg);
            ctx.type = 'json';
        };
        ctx.error = function (msg){
            ctx.body = _.extend({code: -1, msg: 'Internal Server Error.'}, msg);
            ctx.type = 'json';
        };

        await next();

    };

}

export default handleMessage;
