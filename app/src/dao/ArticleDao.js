/**
 * Created by ssehacker on 16/7/9.
 */
'use strict';
var logger = require('log4js').getLogger('runtime');
import ModelDao from './ModelDao';


class ArticleDao extends ModelDao{
    constructor(){
        super('Article');
    }

    async find(condition, fields, options){
        let records=[];
        try{
            records = await new Promise((resolve, reject)=>{
                this.model
                    .find(condition, fields, options)
                    .populate('user')
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
                    .populate('user')
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

    // async count(condition) {
    //     let count =0;
    //     try{
    //         count = await new Promise((resolve, reject)=> {
	//
    //             this.model.count(condition)
    //                 .lean()
    //                 .exec((err, count)=>{
    //                     if(err){
    //                         reject(err);
    //                         return;
    //                     }
    //                     resolve(count);
    //                 });
    //         });
    //     }catch (err){
    //         throw err;
    //     }
    //     return count;
    // }

}

export default ArticleDao;