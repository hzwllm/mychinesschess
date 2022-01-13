import cluster from 'cluster';
import http from 'http';
import os,{ cpus } from 'os';
import process from 'process';

const numCPUs = cpus().length;
console.log(cpus())
console.log(os.userInfo())
if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  // 衍生工作进程。
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  // 工作进程可以共享任何 TCP 连接
  // 在本示例中，其是 HTTP 服务器
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end('hello world\n');
  console.log(3456789)
  console.log(`Worker ${process.pid} 监听`);

  }).listen(8000);
  console.log(3456789)
  console.log(`Worker ${process.pid} started`);
}