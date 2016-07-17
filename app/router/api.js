'use strict';

var router = require('koa-router')();
var logger = require('log4js').getLogger('runtime');

import ArticleDao from '../src/dao/ArticleDao';
import UserDao from '../src/dao/UserDao';
import Status from '../src/Status';

var md = require('markdown-it')({
	breaks: true
});
import _ from 'underscore';


let config = require('../src/util/loadConfig')();


const articleDao = new ArticleDao();
const userDao = new UserDao();

function isQueryBodyNull(ctx){
	if(!ctx.request.body){
		ctx.error({
			msg: 'Request body should not be null!'
		});
	}
}

router.post('/api/article', async(ctx, next)=> {
	if(isQueryBodyNull(ctx)){
		return;
	}
	let body = ctx.request.body;
	let title = body.title;
	let markdown =body.content;
	let content = md.render(markdown);
	let viewCount = 0;
	let tags = body.tags || [];

	//todo: deal with user
	let user = await userDao.findOne({
		name: '周勇'
	});
	
	if(!user){
		user = await userDao.insert({
			name: '周勇'
		});
	}

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

router.get('/api/article', async(ctx, next)=>{
	if(isQueryBodyNull(ctx)){
		return;
	}
	let maxPageSize = 30, defaultPageSize = 10;
	let maxCount = await articleDao.count({});

	let body = ctx.request.body;
	let currentPage = parseInt(body.currentPage) || 1;
	if(currentPage<1 || currentPage> maxCount){
		currentPage = 1;
	}
	let pageSize = parseInt(body.pageSize) || defaultPageSize;
	if(pageSize > maxPageSize || pageSize<5){
		pageSize = defaultPageSize;
	}

	let articles = await articleDao.find({}, {}, {limit: pageSize, skip: pageSize * (currentPage-1)});

	let defaultUri = config.cdn + '/public/noimage.gif';

	articles.forEach((article)=> {
		let regRes = article.content.match(/https?:\/\/.+\.(gif|png|jpe?g|svg)/);

		article.preImg = regRes && regRes[0] || defaultUri;
	});
	ctx.success({
		articles
	});

});

router.get('/api/article/:id', async(ctx, next)=> {
	let id = ctx.params.id;
	let article = await articleDao.findOne({_id: id});
	ctx.success({article});
});

//todo: username should be email.
function validateUser(username, password){
	if(username && password && password.length>=6){
		return true;
	}
	return false;
}

router.post('/api/user', async(ctx, next)=>{
	let body = ctx.request.body;
	let username = body.username;
	let password = body.password;

	if(!validateUser(username, password)){
		ctx.error(Status.USER_VALIDATE_ERROR);
		return;
	}
	
	let isExist =await userDao.findOne({name: username});
	if(isExist){
		ctx.error(Status.USER_EXIST);
		return;
	}

	try{
		await userDao.insert({
			name: username,
			password: password
		});
		ctx.success();
	}catch(e){
		ctx.error(e);
		return;
	}



});


module.exports = router;