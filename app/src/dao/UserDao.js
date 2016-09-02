/**
 * Created by ssehacker on 16/7/9.
 */
'use strict';
var logger = require('log4js').getLogger('runtime');
import ModelDao from './ModelDao';
import util  from '../util/util';

class UserDao extends ModelDao{
    constructor(){
        super('User');
    }

    async checkUser(username, password){
        let isLegal = false;
        let hash = util.encrypt(password);
        let user = await this.findOne({name: username, password: hash});
        if(user){
            isLegal = true;
        }

        return isLegal;
    }
    

}

export default UserDao;