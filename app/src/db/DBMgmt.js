/**
 * Created by ssehacker on 16/7/9.
 */
var mongoose = require('mongoose')
    , Schema = mongoose.Schema;
var logger = require('log4js').getLogger('runtime');


class DBMgmt {
    static instance;
    constructor(){
        if(!DBMgmt.instance) {
            DBMgmt.instance = this;
        }else{
            return DBMgmt.instance;
        }


        this.initConn();
        return DBMgmt.instance;

    }

    getModels(){

        if( this.models ){
            return this.models;
        }

        let User = mongoose.model('User', Schema({
            id: Schema.Types.ObjectId,
            name: String,
            createDate: {type: Number, default: Date.now()},
            lastUpdate: {type: Number, default: Date.now()}
        }));

        let Article = mongoose.model('Article', Schema({
            id: Schema.Types.ObjectId,
            title: String ,
            content: String,
            tags: [],
            user: { type: Schema.Types.ObjectId, ref: 'User' },
            viewCount: Number,
            createDate: {type: Number, default: Date.now()},
            lastUpdate: {type: Number, default: Date.now()}
        }));
        this.models = {
            User,
            Article
        };

        return this.models;
    }

    initConn(){
        // if (this.db){
        // 	return this.db;
        // }
        mongoose.connect('mongodb://localhost/blog');
        var db = mongoose.connection;
        this.db= db;

        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function (callback) {
            logger.debug('MongoDB is connected.');
        });

        // return db;
    }

}

export default DBMgmt;