'use strict';

var Koa = require('koa');
var path = require('path');
const app = new Koa();
var log4js = require('log4js'); 
log4js.loadAppender('file');
log4js.addAppender(log4js.appenders.file('logs/runtime.log'), 'runtime');
var logger = log4js.getLogger('runtime');
import handleMessage from '../app/middleware/handleMessage';

var koaBody = require('koa-body');
app.use(koaBody({formidable:{uploadDir: __dirname}}));

const session = require('koa-session');
const convert = require('koa-convert');
app.keys = ['secret', 'key'];

app.use(convert(session(app)));

app.use(handleMessage());

//异常处理, 必须放在所有中间件的最前面
app.use(async function(ctx, next){
	try{
		await next();
	}catch(err){
		ctx.status = err.status || 500;
		ctx.body = err.message;
		logger.error(err);
	}
});


var views = require('koa-views');
app.use(views( path.resolve(__dirname , '../app/views') , {
	extension: 'jade',
	pretty: true, //not work?? why???
	map: {
		jade: 'jade'
	}
}));


var serve = require('koa-static');
app.use(serve(__dirname + '/static'));

//koa v2
app.use(async function responseTime(ctx, next){
	var start = new Date();
	await next();
	var ms = new Date() -start;
	ctx.set('X-Response-Time', ms+'ms');
	logger.info('X-Response-Time: '+ ms+'ms');

});

var router = require('../app/router/router.js');

app.use(require('../app/router/api.js').routes());

app
  .use(router.routes())
  .use(router.allowedMethods());



app.listen(9090);



