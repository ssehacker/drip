/**
 * Created by ssehacker on 16/7/9.
 */
// import log4js from 'log4js';
import ModelDao from './ModelDao';
import util from '../util/util';

// const logger = log4js.getLogger('runtime');
class UserDao extends ModelDao {
  constructor() {
    super('User');
  }

  async checkUser(username, password) {
    let isLegal = false;
    const hash = util.encrypt(password);
    const user = await this.findOne({ name: username, password: hash });
    if (user) {
      isLegal = true;
    }
    return isLegal;
  }
}

export default UserDao;
