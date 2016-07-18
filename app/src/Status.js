/**
 * Created by ssehacker on 16/7/17.
 */

'use strict';
let status = {
    USER_VALIDATE_ERROR: {
        code: -101,
        msg: '用户名或密码不合法'
    },
    USER_EXIST: {
        code: -102,
        msg: '该用户名已经被使用啦~'
    },
    AUTH_FAILED: {
        code: -103,
        msg: '用户名或密码错误'
    },
    USER_AUTH_FAILED: {
        code: -104,
        msg: '用户未登录'
    }
};

export default status;