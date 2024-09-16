## MixFile自定义线路例子
安装nodejs,输入npm i 安装依赖 \
编辑app.js,cookie后的值更换为登录微博后的cookie \
cookie获取教程: https://blog.csdn.net/lzsm_/article/details/126088857 \
默认监听端口 5001
referer在上传时填写https://weibo.com/ 否则文件无法下载/播放

image为图片,可自定义逻辑返回自定义图片,可返回随机图片(一个文件上传时只会访问一次图片)

如果需要mixfile在失败时重试,请返回500状态码