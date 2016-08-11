'use strict';

var router = require('koa-router')();
var logger = require('log4js').getLogger('runtime');
let config = require('../src/util/loadConfig')();

router.get('/', async (ctx, next) =>{
	await ctx.render('index.jade', {
		host: config.cdn
	});
});

router.get('/admin', async (ctx, next) =>{
	logger.info('ctx.session.username===', ctx.session.username);
	
	if(!ctx.session.username){
		ctx.redirect('/');
	}
	await ctx.render('admin.jade', {
		host: config.cdn
	});
});

router.get('/:userid', async (ctx, next) =>{
	// console.log('ctx.params.userid==', ctx.params.userid);
	await ctx.render('theme.jade', {
		host: config.cdn
	});
});




module.exports= router;