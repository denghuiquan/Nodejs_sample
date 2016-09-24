/**
 * 基准测试：
 * benchmark模块
 * 
 */

var nativeMap = function(arr, callback){
	// 迭代一个数组，根据回调函数的返回值得到一个新的数组
	return arr.map(callback)
};

var customMap = function(arr, callback){
	var ret = [];
	for (var i = 0; i < arr.length; i++) {
		ret.push(callback(arr[i], i ,arr));		
	};

	return ret;
};

var run = function(name, times, fn, arr, callback){
	var start =(new Date()).getTime();
	for (var i = 0; i < times; i++) {
		fn(arr,callback);
	};

	var end = (new Date()).getTime();
	console.log('Running %s %d times cost %d ms',name, times, end-start);
};

var callback = function(item){
	return item+10;
};

run('nativeMap',1000000,nativeMap,[0,1,2,3,4,5,6,7,8,9],callback);
run('customMap',1000000,customMap,[0,1,2,3,4,5,6,7,8,9],callback);



/**
 * 使用benchmark模块：
 * 
 */
var Benchmark = require('benchmark');
var suite = new Benchmark.Suite();
var arr = [0,1,2,3,4,5,6,7,8,9];
suite.add('nativeMap',function(){
	return arr.map(callback);
}).add('customMap',function(){
	var ret = [];
	for (var i = 0; i < arr.length; i++) {
		ret.push(callback(arr[i]));		
	};

	return ret;
}).on('cycle',function(event){
	console.log(String(event.target));
}).on('complete',function(){
	console.log('Fastest is '+ this.filter('fastest').pluck('name'));
}).run();



/**
 * 压力测试：
 * 还会对网络接口进行压力测试以判断网络接口的性能。考察指标有几个：
 * 吞吐量、响应时间和并发数。
 * 这些指标反映的是服务器的处理能力。
 *
 * 常用的工具是ab、siege、http_load等。
 */

var app =connect();
// 记录访问日志
connect.logger.format('home', ':remote-addr :response-time - [:data] ":method :url 
	HTTP/:http-version" :status :res[content-length] ":referrer" "user-agent" :res[content-length]');

app.use(connect.logger({
	format:'home',
	stream:fs.createWriteStream(__dirname+'/log/access.log')
}));


/**
 * 自定义异常日志记录方式
 */
var info = fs.createWriteStream(logdir+'/info.log', {flags:'a',mode:'0666'});
var error = fs.createWriteStream(logdir+'/error.log', {flags:'a',mode:'0666'});

var logger = new console.Console(info,error);

logger.log('hello world!');
logger.info('info:hi!');
logger.error('error: index 100 cols');


/**
 * 底层或中间层Api写法
 */
exports.find = function(id, callback){
	// SQL
	db.query(sql, function(err, rows){
		if (err) {
			return callback(err);
		};
		// 处理结果
		var data = rows.sort();
		callback(null, data);
	});
};


/**
 * 业务层调用的写法
 */
exports.index = function(req, res){
	proxy.find(id,function(err, rows){
		if (err) {
			logger.error(err);
			res.writeHead(500);
			res.end('Error');
			return;
		};
        // 处理结果
		res.writeHead(200);
		res.end(rows);
	});
};



/**
 * 日志记录格式化方法
 */
var format = function(msg){
	var ret = '';
	if (!msg) {
		return ret;
	};

	var date = moment();
	var time = date.format('YYYY-MM-DD HH:mm:ss.SSS');

	if (msg instanceof Error) {
		var err = {
			name: msg.name,
			data:ms.data
		};

		err.stack = msg.stack;

		ret = util.format('%s %s: %s\nHost: %s\nData: %j\n%s\n\n',
			time, err.name, err.stack, os.hostname(), err.data, time);

		console.log(ret);
	} else{
		ret = time + ' '+ util.format.apply(util, arguments)+'\n';
	};

	return ret;
};



// 使用方式
var input = '{error:format}';
try{
	JSON.parse(input);
}catch(ex){
	ex.data = input;
	logger.error(format(ex));
};