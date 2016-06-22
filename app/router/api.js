'use strict';

var router = require('koa-router')();
var logger = require('log4js').getLogger('runtime');

var mockAnswers = require('../data/mockAnswers.js');
router.get('/api/answer', async (ctx, next) =>{
	//mock data
	
	ctx.body = {
		msg: '',
		code: 0,
		data: mockAnswers
	};
	ctx.type = 'json';
});

router.get('/api/answer/:id', async (ctx, next)=> {
	ctx.body = {
		msg: '',
		code: 0,
		data: mockAnswers[0]
	};
	ctx.type = 'json';
});


module.exports = router;