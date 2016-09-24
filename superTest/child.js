/**
 * 子进程
 * @param  {[type]} m            [description]
 * @param  {[type]} server){	if (m            [description]
 * @return {[type]}              [description]
 */
// child.js 
var http = require('http');
var server = http.createServer(function(req,res){
	res.writeHead(200,{'Content-Type':'text/plain'});
	res.end('handled by child, pid is '+ process.pid+'\n');
})
process.on('message',function(m,tcp){
	if (m=='server') {
		/*server.on('connection', function(socket){
			socket.end('child got message and handle!\n  pid is '+process.pid+'\n');
		});*/
		tcp.on('connection',function(socket){
			server.emit('connection',socket);
		});
	}
});
