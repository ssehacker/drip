/**
 * Created by ssehacker on 16/7/17.
 */
const status = {
  INTERNAL_ERROR: {
    code: -1,
    msg: '服务器内部错误',
  },
  UNKNOWN_ERROR: {
    code: -2,
    msg: '未知错误',
  },
  PARAMS_ERROR: {
    code: -3,
    msg: '请求阐述错误',
  },
  USER_VALIDATE_ERROR: {
    code: -101,
    msg: '用户名或密码不合法',
  },
  USER_EXIST: {
    code: -102,
    msg: '该用户名已经被使用啦~',
  },
  AUTH_FAILED: {
    code: -103,
    msg: '用户名或密码错误',
  },
  USER_AUTH_FAILED: {
    code: -104,
    msg: '用户未登录',
  },
  USER_FORBID: {
    code: -105,
    msg: '用户名与当前登录用户不一致.',
  },
  FileTypeError: {
    code: -201,
    msg: '文件格式错误',
  },
  FILE_TOO_LARGE: {
    code: -202,
    msg: '文件太大.',
  },
  FILE_NO_MORE_THAN_2M: {
    code: -203,
    msg: '文件太大,不能超过2M',
  },
};

export default status;
