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
	console.log('/admin....');
	await ctx.render('admin.jade', {
		host: config.cdn
	});
});


module.exports= router;