'use strict';

var router = require('koa-router')();
var logger = require('log4js').getLogger('runtime');

var Busboy = require('busboy');

import ArticleDao from '../src/dao/ArticleDao';
import UserDao from '../src/dao/UserDao';
import Status from '../src/Status';
import path from 'path';
import fs from 'fs';
import uuid from 'node-uuid';
import fileType from 'file-type';

var md = require('markdown-it')({
    breaks: true
});
import _ from 'underscore';


let config = require('../src/util/loadConfig')();


const articleDao = new ArticleDao();
const userDao = new UserDao();

function isQueryBodyNull(ctx) {
    if (!ctx.request.body) {
        ctx.error({
            msg: 'Request body should not be null!'
        });
    }
}

router.post('/api/article', async(ctx, next)=> {
    if (!ctx.session.username) {
        ctx.error(Status.USER_AUTH_FAILED);
        return;
    }
    let user = await userDao.findOne({
        name: ctx.session.username
    });
    if (!user) {
        ctx.error(Status.USER_AUTH_FAILED);
        return;
    }

    if (isQueryBodyNull(ctx)) {
        return;
    }
    let body = ctx.request.body;
    let title = body.title;
    let markdown = body.content;
    let content = md.render(markdown);
    let viewCount = 0;
    let tags = body.tags || [];

    await articleDao.insert({
        title,
        content,
        markdown,
        viewCount,
        tags,
        user: user._id
    });

    ctx.success();
});

router.get('/api/:userToken/article', async(ctx, next)=> {
    if (isQueryBodyNull(ctx)) {
        return;
    }

    let username = ctx.params.userToken;

    let maxPageSize = 30, defaultPageSize = 10;
    let maxCount = await articleDao.count({});

    let body = ctx.request.body;
    let currentPage = parseInt(body.currentPage) || 1;
    if (currentPage < 1 || currentPage > maxCount) {
        currentPage = 1;
    }
    let pageSize = parseInt(body.pageSize) || defaultPageSize;
    if (pageSize > maxPageSize || pageSize < 5) {
        pageSize = defaultPageSize;
    }

    //todo: 这里需要优化,应该直接从数据库中过滤, 而不是查出来之后再过滤,当数据量大的时候这里需要优化
    let articles = await articleDao.find({}, {}, {limit: pageSize, skip: pageSize * (currentPage - 1)});
    articles = _.filter(articles, (article)=> {
        return article.user.name === username;
    });

    let defaultUri = config.cdn + '/public/noimage.gif';

    articles.forEach((article)=> {
        let regRes = article.content.match(/src=\"(https?:\/\/.+\.(gif|png|jpe?g|svg).*?)\"/);

        article.preImg = regRes && regRes[1] || defaultUri;
    });
    ctx.success({
        articles
    });

});

router.get('/api/:userToken/article/:id', async(ctx, next)=> {
    let username = ctx.params.userToken;
    let id = ctx.params.id;

    let article = await articleDao.findOne({_id: id});
    ctx.success({article});
});

router.get('/api/:userToken/profile', async(ctx, next)=> {
    let username = ctx.params.userToken;
    let user = await userDao.findOne({name: username}, {
        nick: true,
        photo: true,
        resume: true,
        resumeMD: true,
        desc: true
    });
    ctx.success({user});
});

//官网模块

//todo: username should be email.
function validateUser(username, password) {
    if (username && password && password.length >= 6) {
        return true;
    }
    return false;
}

function activeUser(ctx, username) {
    ctx.session.username = username;
}

//注册
router.post('/api/user', async(ctx, next)=> {
    let body = ctx.request.body;
    let username = body.username;
    let password = body.password;
    const photo='/photos/default-photo.jpeg';

    if (!validateUser(username, password)) {
        ctx.error(Status.USER_VALIDATE_ERROR);
        return;
    }

    let isExist = await userDao.findOne({name: username});
    if (isExist) {
        ctx.error(Status.USER_EXIST);
        return;
    }

    try {
        await userDao.insert({
            name: username,
            password: password,
            photo: photo
        });

        activeUser(ctx, username);

        ctx.success();
    } catch (e) {
        logger.error(e);
        ctx.error(e);
        return;
    }

});

//todo 验证用户是否登录
router.put('/api/user/', async(ctx, next)=> {
    let body = ctx.request.body;
    let username = body.name;
    let nick = body.nick;
    let domain = body.domain;
    let desc = body.desc;
    let res;

    if (username && username === ctx.session.username) {
        res = await userDao.update({name: username}, {
            $set: {
                nick: nick,
                domain: domain,
                desc: desc
            }
        });
        ctx.success();
    } else {
        ctx.error(Status.USER_FORBID);
    }

});

//todo 验证用户是否登录
router.patch('/api/user', async(ctx, next)=> {
    let name = ctx.session.username;
    let body = ctx.request.body;
    let resumeMD = body.resumeMD;

    try {
        let resume = md.render(resumeMD);
        let res = await userDao.update({name: name}, {
            $set: {
                resumeMD: resumeMD,
                resume: resume
            }
        });
        ctx.success();
    } catch (err) {
        ctx.error({msg: err});
    }

});

//todo 验证用户是否登录
router.get('/api/user', async(ctx, next)=> {
    let username = ctx.session.username;
    let user = await userDao.findOne({name: username},
        {
            name: true,
            nick: true,
            photo: true,
            resume: true,
            resumeMD: true,
            desc: true,
            domain: true
        }
    );
    ctx.success({
        data: user
    });
});

router.post('/api/login', async(ctx, next)=> {
    let body = ctx.request.body;
    let username = body.username;
    let password = body.password;

    //todo: password sha2
    let user = await userDao.findOne({name: username, password: password});
    if (!user) {
        ctx.error(Status.AUTH_FAILED);
        return;
    }

    activeUser(ctx, username);
    ctx.success();
});

router.post('/api/logout', async(ctx, next)=> {
    ctx.session.username = undefined;
    delete ctx.session.username;
    ctx.success();
});

//上传图片
router.post('/api/upload/photo', async(ctx, next)=> {
    try {
        let photoPath = await new Promise((resolve, reject)=> {
            var busboy = new Busboy({headers: ctx.req.headers});
            let photoPath;
            const MAX_SIZE = 1024*1024*2; //文件最大2M.
            busboy.on('file', async function (fieldname, file, filename, encoding, mimetype) {
                let saveTo, type;
                let size = 0;
                file.on('data', (chunk)=> {
                    if (!type) {
                        type = fileType(chunk);
                        if (type && /image\/*/.test(type.mime)) {
                            let newName = uuid.v1() + filename.substring(filename.lastIndexOf('.'), filename.length);
                            saveTo = path.resolve('uploads', 'photos', newName);
                            photoPath = '/photos/' + newName;

                        } else {
                            reject(Status.FileTypeError);
                            return;
                        }
                    }
                    if (type) {
                        size += chunk.length;
                        if(size > MAX_SIZE){
                            fs.unlinkSync(saveTo);
                            reject(Status.FILE_NO_MORE_THAN_2M);
                            return;
                        }
                        fs.appendFileSync(saveTo, chunk);
                    }
                });

                file.on('end', ()=> {
                    if (photoPath) {
                        logger.info('File ' + saveTo + ' Finished,' + size + ' bytes');
                    } else {
                        reject(Status.UNKNOWN_ERROR);
                    }

                });

            });

            busboy.on('finish', async function () {

                if (photoPath) {
                    let res = await userDao.update({name: ctx.session.username}, {
                        $set: {
                            photo: photoPath
                        }
                    });

                    res.ok && resolve(photoPath);
                } else {
                    reject(Status.UNKNOWN_ERROR);
                }

            });

            ctx.req.pipe(busboy);
        });

        ctx.success({
            data: photoPath
        });
    } catch (err) {
        logger.error(err);
        ctx.error(err);
    }
});


module.exports = router;