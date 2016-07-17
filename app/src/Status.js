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
};

export default status;