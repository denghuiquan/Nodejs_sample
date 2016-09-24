/*
fibonacci 函数的定义为 int fibonacci(int n)，调用函数的路径是 '/fib?n=10'，然后这个接口会返回 '55'。函数的行为定义如下：

当 n === 0 时，返回 0；n === 1时，返回 1;
n > 1 时，返回 fibonacci(n) === fibonacci(n-1) + fibonacci(n-2)，如 fibonacci(10) === 55;
n 不可大于10，否则抛错，http status 500，因为 Node.js 的计算性能没那么强。
n 也不可小于 0，否则抛错，500，因为没意义。
n 不为数字时，抛错，500。

test/main.test.js: 对 app 的接口进行测试，覆盖以上所有情况。
 */

/*
知识点：
	学习 supertest 的使用 (https://github.com/tj/supertest )
	复习 mocha，should 的使用
 */
// supertest 是 superagent 的孪生库
// 作者叫 tj
// 他的贡献是在 Node.js 的方方面面都贡献了非常高质量和口碑的库，
// 比如 mocha 是他的，superagent 是他的，express 是他的，should 也是他的，
// 还有其他很多很多，比如 koa，都是他的。

var express = require('express');

// 与之前一样
var fibonacci = function (n) {
  // typeof NaN === 'number' 是成立的，所以要判断 NaN
  if (typeof n !== 'number' || isNaN(n)) {
    throw new Error('n should be a Number');
  }
  if (n < 0) {
    throw new Error('n should >= 0')
  }
  if (n > 10) {
    throw new Error('n should <= 10');
  }
  if (n === 0) {
    return 0;
  }
  if (n === 1) {
    return 1;
  }

  return fibonacci(n-1) + fibonacci(n-2);
};
// END 与之前一样

var app = express();

app.get('/fib', function (req, res) {
  // http 传来的东西默认都是没有类型的，都是 String，所以我们要手动转换类型
  var n = Number(req.query.n);
  try {
    // 为何使用 String 做类型转换，是因为如果你直接给个数字给 res.send 的话，
    // 它会当成是你给了它一个 http 状态码，所以我们明确给 String
    res.send(String(fibonacci(n)));
  } catch (e) {
    // 如果 fibonacci 抛错的话，错误信息会记录在 err 对象的 .message 属性中。
    // 拓展阅读：https://www.joyent.com/developers/node/design/errors
    res
      .status(500)
      .send("Occur Error："+e.message);
  }
});

/*===  `正则表达式  ====*/

var match1= /a/.test('A') // => false
var match2= /a/i.test('A') // => true

var match3= 'hello hell hoo'.match(/h.*?\b/) // => [ 'hello', index: 0, input: 'hello hell hoo' ]
var match4 ='hello hell hoo'.match(/h.*?\b/g) // => [ 'hello', 'hell', 'hoo' ]

var match5 ='123\naaa\nbbb\nccc'.match(/^[\s\S]*?$/g) // => [ 'aaa\nbbb\nccc' ]
var match6 ='aaa\nbbb\nccc'.match(/^[\s\S]*?$/gm) // => [ 'aaa', 'bbb', 'ccc' ]

console.log(match1) 
console.log(match2) 
console.log(match3) 
console.log(match4) 
console.log(match5) 
console.log(match6) 


// 暴露 app 出去。module.exports 与 exports 的区别请看《深入浅出 Node.js》
module.exports = app;

app.listen(3000, function () {
  console.log('app is listening at port 3000');
});


// 装个 nodemon https://github.com/remy/nodemon 。
/*
$ npm i -g nodemon

这个库是专门调试时候使用的，它会自动检测 node.js 代码的改动，
然后帮你自动重启应用。在调试时可以完全用 nodemon 命令代替 node 命令。

$ nodemon app.js
 */


/*=========================== 关于 cookie 持久化 ======================= */
/*
两种思路

1、在 supertest 中，可以通过 var agent = supertest.agent(app) 获取一个 agent 对象，
这个对象的 API 跟直接在 superagent 上调用各种方法是一样的。
agent 对象在被多次调用 get 和 post 之后，可以一路把 cookie 都保存下来。

var supertest = require('supertest');
var app = express();
var agent = supertest.agent(app);

agent.post('login').end(...);
// then ..
agent.post('create_topic').end(...); // 此时的 agent 中有用户登陆后的 cookie

------------------------------------------------------------------------------

2、在发起请求时，调用 .set('Cookie', 'a cookie string') 这样的方式。

var supertest = require('supertest');
var userCookie;
supertest.post('login').end(function (err, res) {
    userCookie = res.headers['Cookie']
  });
// then ..

supertest.post('create_topic')
  .set('Cookie', userCookie)
  .end(...)

 */

