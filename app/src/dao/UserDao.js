/**
 * Created by ssehacker on 16/7/9.
 */
'use strict';
var logger = require('log4js').getLogger('runtime');
import ModelDao from './ModelDao';


class UserDao extends ModelDao{
    constructor(){
        super('User');
    }

}

export default UserDao;