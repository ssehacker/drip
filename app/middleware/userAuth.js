/**
 * Created by ssehacker on 16/9/2.
 */
import Status from '../src/Status';
import _ from 'underscore';

//以下请求需要登录才能访问
let requestsNeedAuth =[
	{
		path: '/api/article/:id',
		method: 'DELETE'
	},
	{
		path: '/api/article/:id',
		method: 'PUT'
	},
	{
		path: '/api/article',
		method: 'GET'
	},
	{
		path: '/api/user',
		method:'PUT'
	},
	{
		path: '/api/user',
		method:'PATCH'
	},
	{
		path: '/api/user',
		method:'GET'
	},
	{
		path: '/api/logout',
		method:'POST'
	}
];

function match(path, method) {
	return _.find(requestsNeedAuth, (item)=>{
		return item.path === path && item.method === method;
	});
}

export default async function(ctx, next){
	console.log('==========middleware',ctx.path,  ctx.method);
	if ( match(ctx.path, ctx.method) && !ctx.session.username) {
		ctx.error(Status.USER_AUTH_FAILED);
		return;
	}
	await next();
};