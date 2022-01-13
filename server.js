var express = require('express');

// socket
var path = require('path')
var {
    websocket,
    socketList
} = require('./websocket')
websocket(8888)
// var {
//     fswatch
// } = require('./fswatch')
// fswatch('./', socketList)
var app = express();
// const {
//     com
// } = require('./func')

// 设置静态资源目录访问index.html直接
app.use(express.static('./'));
app.use('/',(req, res,next) => {
    // if(req.path=='/'){
    res.redirect('/src/index.html')
    console.log(socketList.length,1234)
    // }
    // console.log(req.path)
    next()
}
)
app.all('*',(req,res,next)=>{
    // console.log(req)
    next()
})
// com(app)
app.listen(3000);
console.log('Proxy server is listen at port 3000...');