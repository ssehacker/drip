/**
 * Created by ssehacker on 16/7/9.
 */
import mongoose from 'mongoose';
import log4js from 'log4js';

const logger = log4js.getLogger('runtime');
const Schema = mongoose.Schema;
class DBMgmt {
  constructor() {
    if (!DBMgmt.instance) {
      DBMgmt.instance = this;
    } else {
      return DBMgmt.instance;
    }

    this.initConn();
    return DBMgmt.instance;
  }

  getModels() {
    if (this.models) {
      return this.models;
    }
    const User = mongoose.model('User', Schema({
      id: Schema.Types.ObjectId,
      nick: String,
      name: String,
      password: String, // todo: sha2
      photo: String, // path
      desc: String,
      resume: String, // 一些自定义的信息,就像简历一样,用markdown编写,然后转义成html
      resumeMD: String,
      contact: String,
      contactMD: String,
      domain: String,
      customDomain: String,
      createDate: { type: Number, default: Date.now() },
      lastUpdate: { type: Number, default: Date.now() },
    }));

    const Article = mongoose.model('Article', Schema({
      id: Schema.Types.ObjectId,
      title: String,
      markdown: String,
      content: String,
      tags: [],
      user: { type: Schema.Types.ObjectId, ref: 'User' },
      viewCount: { type: Number, default: 0 },
      createDate: { type: Number, default: Date.now() },
      lastUpdate: { type: Number, default: Date.now() },
    }));
    this.models = {
      User,
      Article,
    };

    return this.models;
  }

  initConn() {
    mongoose.connect('mongodb://localhost/blog');
    const db = mongoose.connection;
    this.db = db;

    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', (callback) => {
      logger.debug('MongoDB is connected.');
      if (callback) {
        callback();
      }
    });
  }
}

export default DBMgmt;
