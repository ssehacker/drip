/**
 * Created by ssehacker on 16/7/9.
 */
import log4js from 'log4js';
import ModelDao from './ModelDao';

const logger = log4js.getLogger('runtime');

class ArticleDao extends ModelDao {
  constructor() {
    super('Article');
  }

  async find(condition, fields, options) {
    let records = [];
    try {
      records = await new Promise((resolve, reject) => {
        this.model
          .find(condition, fields, options)
          .populate('user')
          .lean()
          .exec((err, recs) => {
            if (err) {
              logger.error(err);
              reject(err);
            }
            resolve(recs);
          });
      });
    } catch (err) {
      logger.error(err);
      throw err;
    }
    return records;
  }

  async findOne(condition, fields, options) {
    let record;
    try {
      record = await new Promise((resolve, reject) => {
        this.model
          .findOne(condition, fields, options)
          .lean()
          .populate('user')
          .exec((err, recs) => {
            if (err) {
              reject(err);
            }
            resolve(recs);
          });
      });
    } catch (err) {
      throw err;
    }
    return record;
  }
}
export default ArticleDao;
