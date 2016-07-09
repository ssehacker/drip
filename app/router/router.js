'use strict';

var router = require('koa-router')();
var logger = require('log4js').getLogger('runtime');

router.get('/', async (ctx, next) =>{
	await ctx.render('index.jade', {
		host: 'http://127.0.0.1:3002'
	});
});

router.get('/admin', async (ctx, next) =>{
	console.log('/admin....');
	await ctx.render('admin.jade', {
		host: 'http://127.0.0.1:3002'
	});
});


module.exports= router;