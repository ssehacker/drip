'use strict';

var router = require('koa-router')();
var logger = require('log4js').getLogger('runtime');

router.get('/', async (ctx, next) =>{
	await ctx.render('index.jade', {
		host: 'http://127.0.0.1:3002'
	});
});


module.exports= router;