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
}

export default ArticleDao;