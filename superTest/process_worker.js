/**
 * process_worker.js
 * @type {[type]}
 */
var http= require("http");
var server= http.createServer(function(req,res){
  res.writeHead(200,{'Content-Type':'text/plain'});
  res.end("Hello Process!\n");

  });

// 随机监听>1000的端口
var port =Math.round((1+Math.random())*1000);
// port=1111;
server.listen(port,"127.0.0.1");
console.log("listening port:"+port+"......");