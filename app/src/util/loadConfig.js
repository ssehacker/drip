/**
 * Created by ssehacker on 16/7/10.
 */
module.exports = function loadConfig(){
    let NODE_ENV = process.env.NODE_ENV || '';
    let config;
    if(NODE_ENV.toLowerCase() === 'dev'){
        config = require('../config/config.dev');
    }else {
        config = require('../config/config.prod');
    }
    return config;
}