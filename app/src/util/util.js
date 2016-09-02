/**
 * Created by ssehacker on 16/8/7.
 */
let util = {};
import crypto from 'crypto';

util.sleep = function(ms){
	let later = Date.now()+ms;
	while(Date.now()< later){
		
	}
};

util.encrypt = function (password){
	let solt = 'toBeAFreeMan';
	let hash = crypto.createHash('sha256');
	hash.update(password);
	let code = hash.digest('hex');
	return code;
};

export default util;