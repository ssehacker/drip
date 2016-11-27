/**
 * Created by ssehacker on 16/8/7.
 */
import crypto from 'crypto';

const util = {};
util.sleep = (ms) => {
  const later = Date.now() + ms;
  while (Date.now() < later) {
    /* empty */
  }
};

util.encrypt = (password) => {
  // let solt = 'toBeAFreeMan';
  const hash = crypto.createHash('sha256');
  hash.update(password);
  const code = hash.digest('hex');
  return code;
};

export default util;
