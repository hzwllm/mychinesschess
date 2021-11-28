var express = require('express');

// socket
var path = require('path')
var {
    websocket,
    socketList
} = require('./websocket')
websocket(8888)
var {
    fswatch
} = require('./fswatch')
fswatch('./', socketList)
var app = express();
const {
    com
} = require('./func')
// 设置静态资源目录访问index.html直接
app.use(express.static('./'));
com(app)
app.listen(3000);
console.log('Proxy server is listen at port 3000...');