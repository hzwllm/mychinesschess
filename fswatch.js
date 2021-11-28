// 代码热更新
var fs = require('fs')
// 加密模块
const crypto = require('crypto')
// 同时只保持一个连接或者只向最新的发送信息
function sendmy(opcode, socket) {
    return function (str) {
        const payloadData = Buffer.from(str)
        const send = Buffer.alloc(2 + payloadData.length);
        //0b10000000表示发送结束
        send[0] = opcode | 0b10000000;
        //载荷数据的长度
        send[1] = payloadData.length;
        payloadData.copy(send, 2);
        console.log(socket)
        socket.write(send)
    }
}

function sendmsg(socketList, str) {
    for (let i = 0; i < socketList.length; i++) {
        let send = sendmy(socketList[i].opcode, socketList[i].socket)
        send(str)
    }
}
// 在监听socket链接的时候调用
let filelist = new Map()
exports.fswatch = function (filepath = './', socketList) {
    // 在一毫秒内发送请求不能太多
    let flag = true
    let i = 0
    fs.watch(filepath, {
        recursive: true
    }, (e, filename) => {
        // console.log(socketList)
        console.log(e)
        if (e == 'change') {
            const buffer = fs.readFileSync(filepath + filename)
            const hash = crypto.createHash('md5')
            hash.update(buffer, 'utf-8')
            const md5 = hash.digest('hex')
            let v = filelist.get(filename)
            // console.log(e)11123
            // console.log(v,md5)
            if ((v == md5 || !v) && flag) {
                // send('没有更改'+i++)
                sendmsg(socketList, '没有更改')
                flag = false
                setTimeout(() => {
                    flag = true
                }, 2000);
                if (!v) {
                    filelist.set(filename, md5)
                }
            } else if (flag) {
                // send('更改出现'+i++)
                sendmsg(socketList, '更改出现')
                flag = false
                setTimeout(() => {
                    flag = true
                }, 2000);
                filelist.set(filename, md5)
            }
        }
    })
}