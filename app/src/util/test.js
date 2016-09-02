'use strict'
let crypto = require('crypto');
function encrypt(password){
	let solt = 'toBeAFreeMan';
	let hash = crypto.createHash('sha256');
	hash.update(password);
	let code = hash.digest('hex');

	return code;
};

console.log(encrypt('ssehacker'));
