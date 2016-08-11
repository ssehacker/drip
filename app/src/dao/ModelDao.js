/**
 * Created by ssehacker on 16/7/9.
 */
'use strict';
var logger = require('log4js').getLogger('runtime');
import DBMgmt from '../db/DBMgmt';

let db = new DBMgmt();

class ModelDao {
    constructor(modelName){
        this.model = db.getModels()[modelName];
    }

    async insert(entities){
        let res = await new Promise((resolve, reject)=>{
            this.model.create(entities, function(err, res){
                if(err){
                    logger.error(err);
                    reject( err);
                }
                resolve(res);
            });
        });
        logger.debug('Inserted '+(res && res.length || 1)+' records.');
        return res;
    }

    async remove(options){
        let res = await new Promise((resolve, reject)=>{
            this.model.remove(options, function(err, res){
                if(err){
                    logger.error(err);
                    reject( err);
                }
                resolve(res);
            });
        });
        logger.debug('Removed '+(res && res.length || 1)+' records.');
        return res;
    }


    async find(condition, fields, options){
        let records=[];
        try{
            records = await new Promise((resolve, reject)=>{
                this.model
                    .find(condition, fields, options)
                    .lean()
                    .exec((err, records)=>{
                        if(err){
                            logger.error(err);
                            reject(err);
                        }
                        resolve(records);
                    });

            });
        }catch(err){
            logger.error(err);
            throw err;
        }
        return records;
    }

    async findOne(condition, fields, options){
        let record;
        try{
            record = await new Promise((resolve, reject)=>{
                this.model
                    .findOne(condition, fields, options)
                    .lean()
                    .exec((err, record)=>{
                        if(err){
                            reject(err);
                        }
                        resolve(record);
                    });

            });
        }catch(err){
            throw err;
        }
        return record;
    }

    async update(condition, options){
        let res;
        try{
            res = await new Promise((resolve, reject)=>{
                this.model.update(condition, options, (err, res)=>{
                    if(err){
                        reject(err);
                    }
                    resolve(res);
                });
            });
        }catch(err){
            throw err;
        }
        return res;
    }

    async count(condition) {
        let count =0;
        try{
            count = await new Promise((resolve, reject)=> {

                this.model.count(condition, (err, count)=>{
                    if(err){
                        reject(err);
                        return;
                    }
                    resolve(count);
                });
            })
        }catch (err){
            throw err;
        }
        return count;
    }
}

export default ModelDao;