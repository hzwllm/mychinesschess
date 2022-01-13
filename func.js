const {
    transrou
} = require('./transroute')
// 转发的对象
const {
    createProxyMiddleware
} = require('http-proxy-middleware');
exports.com = function (app) {
    for (let i = 0; i < transrou.length; i++) {
        try {
            let iphost = transrou[i].proxy + '://' + transrou[i].ip 
            console.log(iphost)
            if(transrou[i].host){
                iphost+=':'+transrou[i].host
            }
            app.use(transrou[i].route, createProxyMiddleware({
                // 代理跨域目标接口
                target: iphost,
                changeOrigin: true,

                // 修改响应头信息，实现跨域并允许带cookie
                onProxyRes: function (proxyRes, req, res) {
                    res.header('Access-Control-Allow-Origin', iphost);
                    res.header('Access-Control-Allow-Credentials', 'true');
                    res.header('Access-Control-Allow-Methods', '*');
                    res.header('Content-Type', 'application/json;charset=utf-8');
                },

                // 修改响应信息中的cookie域名
                cookieDomainRewrite: iphost // 可以为false，表示不修改
            }));
        } catch (e) {
            console.log(e)
        }

    }

}