import crypto from 'crypto';

function encrypt(password) {
  // const solt = 'toBeAFreeMan';
  const hash = crypto.createHash('sha256');
  hash.update(password);
  const code = hash.digest('hex');
  return code;
}

console.log(encrypt('ssehacker'));
