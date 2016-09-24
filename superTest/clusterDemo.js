/**
 * [cluster Demo]
 * @type {[type]}
 */
var cluster = require('cluster');
var http = require('http');
var numCpus = require('os').cpus().length;

// cluster.isWorker = ('NODE_UNIQUE_ID' in process.env);
// cluster.isMaster = (cluster.isMaster===false);

console.log(cluster.isWorker+"  "+ cluster.isMaster);

if (cluster.isMaster) {
	// fork workers
	for (var i = 0; i < numCpus; i++) {
		cluster.fork();
	};

	cluster.on('exit', function(worker ,code , signal ){
		console.log('worker '+worker.process.pid + 'died.');
	});
}else{
	// workers can share any tcp connection
	// in this case its a http server
	http.createServer(function(req,res){
		res.writeHead(200,{'Content-Type':'text/html'});
		res.end("<body style='background:blue'><div align='center' style='color:white'>hello!world.</div></body>");
	}).listen(1337);
	console.log('hello!world. at port 1337');
};


/*cluster.setupMaster({
	exec:"worker.js"
});

var cpus = require('os').cpus();
for (var i = 0; i < cpus.length; i++) {
	cluster.fork();
};*/