/**
 * 发送句柄
 * @type {[type]}
 */
/*var child = require('child_process').fork('child.js');

// open up the server object and send the handle
var server = require('net').createServer();
server.on('connection', function(socket){
	socket.end("hello!world! print by parent\n ");
});

server.listen(1337,function(){
	child.send('server',server);
});*/


//========================
var cp =require('child_process');
var child1 = cp.fork('child.js');
var child2 = cp.fork('child.js');

// open up the server object and send the handle
var server = require('net').createServer();
/*server.on('connection', function(socket){
	socket.end("hello!world! print by parent\n ");
});*/

server.listen(1337,function(){
	child1.send('server',server);
	child2.send('server',server);
	// 关掉
	server.close();
});