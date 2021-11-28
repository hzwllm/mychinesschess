const crypto = require('crypto')
// socket
const net = require('net')
//计算websocket校验
function getSecWebSocketAccept(key) {
  return crypto.createHash('sha1')
    .update(key + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11')
    .digest('base64');
}
//掩码操作
function unmask(buffer, mask) {
  const length = buffer.length;
  for (var i = 0; i < length; i++) {
    buffer[i] ^= mask[i & 3];
  }
}
let arr = []

function socketfunc(socket) {
  let id = arr.length > 0 ? arr[arr.length - 1].id : 0

  // 我们获得一个连接 - 该连接自动关联一个socket对象
  // 为这个socket实例添加一个"data"事件处理函数
  socket.once('data', function (data) {
    data = data.toString();
    message = socket
    // console.log(data)
    //查看请求头中是否有升级websocket协议的头信息
    if (data.match(/Upgrade: websocket/)) {
      let rows = data.split('\r\n');
      //去掉第一行的请求行
      //去掉请求头的尾部两个空行
      rows = rows.slice(1, -2);
      let headers = {};
      rows.forEach(function (value) {
        let [k, v] = value.split(': ');
        headers[k] = v;
      });
      //判断websocket的版本
      if (headers['Sec-WebSocket-Version'] == 13) {
        let secWebSocketKey = headers['Sec-WebSocket-Key'];
        //计算websocket校验
        let secWebSocketAccept = getSecWebSocketAccept(secWebSocketKey);
        //服务端响应的内容
        let res = [
          'HTTP/1.1 101 Switching Protocols',
          'Upgrade: websocket',
          `Sec-WebSocket-Accept: ${secWebSocketAccept}`,
          'Connection: Upgrade',
          '\r\n'
        ].join('\r\n');
        //给客户端发送响应内容
        socket.write(res);
        //注意这里不要断开连接，继续监听'data'事件
        socket.on('data', function (buffer) {
          //注意buffer的最小单位是一个字节
          //取第一个字节的第一位，判断是否是结束位
          let fin = (buffer[0] & 0b10000000) === 0b10000000;
          //取第一个字节的后四位，得到的一个是十进制数
          let opcode = buffer[0] & 0b00001111;
          //取第二个字节的第一位是否是1，判断是否掩码操作
          let mask = buffer[1] & 0b100000000 === 0b100000000;
          //载荷数据的长度
          let payloadLength = buffer[1] & 0b01111111;
          //掩码键，占4个字节
          let maskingKey = buffer.slice(2, 6);
          //载荷数据，就是客户端发送的实际数据
          let payloadData = buffer.slice(6);
          //对数据进行解码处理
          unmask(payloadData, maskingKey);
          //向客户端响应数据
          let send = Buffer.alloc(2 + payloadData.length);
          //0b10000000表示发送结束
          send[0] = opcode | 0b10000000;
          //载荷数据的长度
          send[1] = payloadData.length;
          payloadData.copy(send, 2);
          arr.push({
            socket: socket,
            id: id,
            opcode: opcode
          })
          socket.write(send);
          //   var {fswatch}=require('./fswatch')
          //   fswatch('./',socket,opcode | 0b10000000)
        });
      }
    }
  });
  socket.on('error', function (err) {
    console.log(err);
  });
  socket.on('end', function () {
    console.log('连接结束');
  });
  socket.on('close', function () {
    let index = arr.findIndex((it) => it.id == id)
    // arr=arr.splice(index,1)
    console.log('连接关闭');
  });
}
exports.socketList = arr
exports.websocket = function (port = 8888) {
  const socket = net.createServer(socketfunc)
  socket.listen(port, 'localhost', (e) => {
    console.log(e)
  })
}