# drip
一个多人博客系统

### 特性
- 支持换肤
- 现代化设计
- markdown编辑器
- 访问统计与分析

### 安装
1. 绑定域名
在 `/etc/hosts`中添加:
```
127.0.0.1       <your domain>
```

2. 安装必要的软件 
 node 4 以上版本
 npm 3 以上版本
 mongodb

3. 全局安装webpack
```
$ npm install -g webpack
```
4. 编译代码
在drip-front-end项目下执行
```
$ webpack -d
```

在drip项目下执行
```
$ webpack -d
$ npm run publish
```

5. 启动nginx
将drip下的`nginx.conf`文件复制（或以软连接的形式）到`<nginx_dir>/servers/`目录下，并启动nginx
```
$ nginx
```

6. 访问 之前绑定的域名<your domain>
至此，就可以看到项目页面了。



### Nginx 相关知识
####查看nginx的安装路径
`nginx -h`

#### 文件上传大小限制:
在http模块中,配置文件上传的大小:
```nginx
client_max_body_size 2m;
```
不然会返回 413 (Request Entity Too Large). 



### git相关
修复.gitignore修改后不生效
```git
git rm -r --cached .
git add .
git commit -m "fixed untracked files"

```