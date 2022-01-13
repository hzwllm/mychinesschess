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
// 发送操作
function sendmy(opcode, socket,countindex=2) {
  return function (str) {
      const payloadData = Buffer.from(str)
      const send = Buffer.alloc(countindex + payloadData.length);
      // 可以将 buffer 视为整数数组，每个整数代表一个数据字节
      //0b10000000表示发送结束
      if(countindex>=2){
        send[0] = opcode | 0b10000000;
        //载荷数据的长度
        send[1] = payloadData.length;
      }
      // 如果传递数据大于125 小于127
      if(countindex>=4){
        send[2]=(payloadData.length)>>8&0xff
        send[3]=payloadData.length&0xff
      }
      console.log(payloadData.length,countindex)
      payloadData.copy(send, countindex);
      // console.log(socket)
      socket.write(send)
  }
}
// 连接池
let arr = []

function socketfunc(socket) {

  // 我们获得一个连接 - 该连接自动关联一个socket对象
  // 为这个socket实例添加一个"data"事件处理函数
  socket.once('data', function (data) {
    data = data.toString();
    message = socket
    let count = 0
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
          let countindex=2
          if((buffer[1]&127)==126){
            // payloadLength= buffer.readUInt16BE(2)
            // maskingKey = buffer.slice(4, 8)
            // payloadData = buffer.slice(8)
            countindex+=2
          }
          let fin = (buffer[0] & 0b10000000) === 0b10000000;
          //取第一个字节的后四位，得到的一个是十进制数
          let opcode = buffer[0] & 0b00001111;
          //取第二个字节的第一位是否是1，判断是否掩码操作
          let mask = buffer[1] & 0b100000000 === 0b100000000;
          //载荷数据的长度
          let payloadLength = buffer[1] & 0b01111111;
          let maskingKey = buffer.slice(countindex, countindex+4);
          //载荷数据，就是客户端发送的实际数据
          let payloadData = buffer.slice(countindex+4);
          
          //掩码键，占4个字节
          

          //对数据进行解码处理
          unmask(payloadData, maskingKey);
          let mydata = payloadData.toString()
          //向客户端响应数据
          let send = Buffer.alloc(countindex + payloadLength);
          //0b10000000表示发送结束
          if(countindex>=2){
            send[0] = opcode | 0b10000000;
            //载荷数据的长度
            send[1] = payloadData.length;
          }
          // 如果传递数据大于125 小于127
          if(countindex>=4){
            send[2]=(payloadData.length)>>8&0xff
            send[3]=payloadData.length&0xff
          }
          payloadData.copy(send, countindex);
          if (count == 0) {
            socket.USERID=mydata.split('needconnect:')[0]
            arr.push({
              socket: socket,
              id: mydata.split('needconnect:')[0],
              opcode: opcode,
              connectid: undefined
            })
            count++
          }
          if (mydata.indexOf('needconnect:')!==-1) {
            console.log(arr)
            let myid = mydata.split('needconnect:')[1]
            let myindex = arr.findIndex(it => it.id == myid)
            let msg= sendmy(arr[myindex].opcode,socket)
            let newarr = arr.filter(it => it.id != myid && !it.connectid)
            let newlength = newarr.length
            if (newlength > 0) {
              let index = Math.floor(Math.random() * newlength)
              let heindex = arr.findIndex(it => it.id == newarr[index].id)
              arr[myindex].connectid = arr[heindex].id
              arr[heindex].connectid = arr[myindex].id
             let msg1= sendmy(arr[myindex].opcode,socket)
             let msg2= sendmy(arr[heindex].opcode,arr[heindex].socket)
             msg1('连接成功targetid:'+arr[heindex].id)
             msg2('连接成功targetid:'+arr[myindex].id)
             let type=Math.floor(Math.random() * 2)==1?1:-1
             msg1('type:'+type)
             msg2('type:'+(0-type))
              // socket.write(send);
            } else {
              msg('连接失败:未匹配到用户')
            }
          } else if(mydata.indexOf('mymovetoinfo:')!==-1){
              let myindex= arr.findIndex(it => it.socket.USERID === socket.USERID)
              let heindex= arr.findIndex(it => it.id === arr[myindex].connectid)
              let msg= sendmy(arr[heindex].opcode,arr[heindex].socket,countindex)
              msg('hemovetoinfo:'+ mydata.split('mymovetoinfo:')[1])
          }
          
          else {
            socket.write(send);
          }
          //   var {fswatch}=require('./fswatch')
          //   fswatch('./',socket,opcode | 0b10000000)
        });
      }
    }
  });
  socket.on('error', function (err) {
    // arr=arr.filter(it=>{
    //   console.log(it.socket)
    //   return it.socket.connecting==true
    // })
    let c=arr.findIndex(it => it.socket.USERID === socket.USERID)
    if(c!==-1){
    arr.splice(c, 1)
    }

  });
  socket.on('end', function () {
    let c=arr.findIndex(it => it.socket.USERID === socket.USERID)
    if(c!==-1){
    arr.splice(c, 1)
    }
    console.log('连接结束');
  });
  socket.on('close', function (e) {
    console.log(e)
    // let index = arr.findIndex((it) => it.id == id)
    let c=arr.findIndex(it => it.socket.USERID === socket.USERID)
    if(c!==-1){
    arr.splice(c, 1)
    }
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