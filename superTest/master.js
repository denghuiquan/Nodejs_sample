/**
 * master.js
 * @type {[type]}
 */
var cp = require('child_process');
var fork = cp.fork;
var cpus = require('os').cpus();
console.log('当前服务器为4核系统，下面将为应用开启4个线程：');
var finished =0;
// 这段代码会根据当前机器上的cpu数量复制出对应的Node进程数
// 通过fork（）复制的进程都是一个独立的进程，这个进程中有着独立而全新的V8实例。
// 它需要至少30毫秒的启动时间和至少10MB的内存，该进程是昂贵的。
// 在node中，启动多进程只是为了充分利用cpu，而不是为了解决并发问题。
/*while(finished<cpus.length){
	for (var i = cpus.length - 1; i >= 0; i--) {
		fork('./process_worker.js');
		finished=finished+1;
		if (finished==cpus.length) {
			console.log('线程开启完毕...');
		};
	};
}*/

// spawn()
/**
 * Error: spawn UNKNOWN
    at exports._errnoException (util.js:746:11)
    at ChildProcess.spawn (child_process.js:1162:11)
    at exports.spawn (child_process.js:995:9)
 */
// cp.spawn('node',['process_worker.js']);

// exec（）
cp.exec('node process_worker.js',function(err,stdout,stderr){
	console.log('>> exec():node process_worker.js');
});
// execFile( )
/*cp.execFile('process_worker.js',function(err,stdout,stderr){
	console.log('>> execFile(): process_worker.js');
});*/

// fork( )
// cp.fork('./process_worker.js');