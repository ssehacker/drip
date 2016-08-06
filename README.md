# drip
a blog system

### Installation
1. bind domain
add these line to `/etc/hosts`:
```
127.0.0.1       <your domain>
```

2.



### Nginx 相关知识
在Mac上,nginx的路径是:
- `conf`:`/usr/local/etc/nginx/`
- `log`: `usr/local/var/log/nginx/`

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