/**
 * Created by ssehacker on 16/7/9.
 */
import log4js from 'log4js';
import DBMgmt from '../db/DBMgmt';

const logger = log4js.getLogger('runtime');
const db = new DBMgmt();

class ModelDao {
  constructor(modelName) {
    this.model = db.getModels()[modelName];
  }

  async insert(entities) {
    const res = await new Promise((resolve, reject) => {
      this.model.create(entities, (err, res2) => {
        if (err) {
          logger.error(err);
          reject(err);
        }
        resolve(res2);
      });
    });
    logger.debug(`Inserted ${(res && res.length) || 1} records.`);
    return res;
  }

  async remove(options) {
    const res = await new Promise((resolve, reject) => {
      this.model.remove(options, (err, res2) => {
        if (err) {
          logger.error(err);
          reject(err);
        }
        resolve(res2);
      });
    });
    logger.debug(`Removed ${(res && res.length) || 1} records.`);
    return res;
  }


  async find(condition, fields, options) {
    let records = [];
    try {
      records = await new Promise((resolve, reject) => {
        this.model
          .find(condition, fields, options)
          .lean()
          .exec((err, recd) => {
            if (err) {
              logger.error(err);
              reject(err);
            }
            resolve(recd);
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
          .exec((err, recd) => {
            if (err) {
              reject(err);
            }
            resolve(recd);
          });
      });
    } catch (err) {
      throw err;
    }
    return record;
  }

  async update(condition, options) {
    let res;
    try {
      res = await new Promise((resolve, reject) => {
        this.model.update(condition, options, (err, res2) => {
          if (err) {
            reject(err);
          }
          resolve(res2);
        });
      });
    } catch (err) {
      throw err;
    }
    return res;
  }

  async count(condition) {
    let count = 0;
    try {
      count = await new Promise((resolve, reject) => {
        this.model.count(condition, (err, num) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(num);
        });
      });
    } catch (err) {
      throw err;
    }
    return count;
  }
}

export default ModelDao;
