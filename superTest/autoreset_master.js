/**
 * master.js
 */
var fork = require('child_process').fork;
var cpus = require('os').cpus();

var server = require('net').createServer();
server.listen(1337);

// 重启次数
var limit = 10;
// 时间单位
var during = 60000;
// 重启队列
var restart = [];
var isTooFrequently = function(){
	// 记录重启时间
	var time = Date.now();
	var length = restart.push(time);
	if (length>limit) {
		// 取出最后10个记录
		restart = restart.slice(limit*-1);
	};
	// 最后一次重启到前10次重启之间的时间间隔
	return (restart.length>=limit)&&(restart[restart.length-1]-restart[0]<during);
}


var workers = {};
var createWorker = function(){
	// 检查是否重启太过频繁
	if (isTooFrequently()) {
		// 触发giveup事件后，不再重启
		process.emit('giveup', limit , during);
		// 记录日志
		console.error("giveup restart because of TooFrequently.");
		return;
	};

	var worker = fork(__dirname+'/autoreset_worker.js');


	// 退出时重新启动新的进程
	worker.on('exit',function(){
		console.log('Worker '+worker.pid + ' exited.');
		delete workers[worker.pid];
		// createWorker();
	});

	// 接收到子进程的自杀信号就创建新的进程服务
	worker.on('message', function(message){
		if (message.act === 'suicide') {
			createWorker();
		};
	});

	// 句并转发
	worker.send('server', server);
	workers[worker.pid]= worker;
	console.log('Craete worker.pid：'+worker.pid);
};

for (var i = 0; i < cpus.length; i++) {
	createWorker();
};

// 进程自己退出时，让所有工作进程退出
process.on('exit', function(){
	for(var pid in workers){
		workers[pid].kill();
	}
});