/*===============================   benchmark 怎么写    =======================================*/
/*
目标：
	有一个字符串 var number = '100'，我们要将它转换成 Number 类型的 100。

	目前有三个选项：+, parseInt, Number

	请测试哪个方法更快。
 */

/* 知识点
	1、学习使用 benchmark 库
	2、学习使用 http://jsperf.com/ 分享你的 benchmark
 */

/*
弄个 benchmark 库，https://github.com/bestiejs/benchmark.js 。
	这个库已经两年没有更新了，两年前发了个 1.0.0 版本，直到现在。
	照着官网的 copy 下来就好。

	Using npm:
		$ npm i --save benchmark

	In Node.js:
		var Benchmark = require('benchmark');

 */

var Benchmark = require('benchmark');

var suite = new Benchmark.Suite;

// add tests
suite.add('RegExp#test', function() {
  /o/.test('Hello World!');
})
.add('String#indexOf', function() {
  'Hello World!'.indexOf('o') > -1;
});
/*// add listeners
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').pluck('name'));
})
// run async
.run({ 'async': true });*/

// logs:
// => RegExp#test x 4,161,532 +-0.99% (59 cycles)
// => String#indexOf x 6,139,623 +-1.00% (131 cycles)
// => Fastest is String#indexOf
// 

var int1 = function (str) {
  return +str;
};

var int2 = function (str) {
  return parseInt(str, 10);
};

var int3 = function (str) {
  return Number(str);
};


var number = '100';

// 添加测试
suite
.add('+', function() {
  int1(number);
})
.add('parseInt', function() {
  int2(number);
})
.add('Number', function () {
  int3(number);
})
// 每个测试跑完后，输出信息
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').pluck('name'));
})
// 这里的 async 不是 mocha 测试那个 async 的意思，这个选项与它的时间计算有关，默认勾上就好了。
.run({ 'async': true });