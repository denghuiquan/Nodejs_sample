// 引用我们的 main.js，并开始一个简单的测试
// 装个全局的 mocha: $ npm install mocha -g。
//	装个 should: npm install should --save-dev
/*
// npm install expect.js
 
-g 与 非-g 的区别，就是安装位置的区别，g 是 global 的意思。
如果不加的话，则安装 mocha 在你的项目目录下面；
如果加了，则这个 mocha 是安装在全局的，
如果 mocha 有可执行命令的话，那么这个命令也会自动加入到你系统 $PATH 中的某个地方
*/

// 
// 
// file: test/main.test.js

var main = require('../main');
var should = require('should');

var user = {
    name: 'tj'
  , pets: ['tobi', 'loki', 'jane', 'bandit']
};

describe('test/main.test.js', function () {
  it('should equal 55 when n === 10', function () {
    // console.log('\tchecked:fibonacci(10)='+main.fibonacci(10));
    main.fibonacci(10).should.equal(55);    
  });

  it('should 5 > 4', function () {
    (5).should.above(4); 
  });
  
  it('should foobar startWith foo', function () {
    'foobar'.should.startWith('foo');
  });  
    
});


/*
	assert.fail(actual, expected, message, operator) // just write wrong should assertion
	assert(value, message), assert.ok(value, [message]) // should(value).ok
	assert.equal(actual, expected, [message]) // should(actual).eql(expected, [message])
	assert.notEqual(actual, expected, [message]) // should(actual).not.eql(expected, [message])
	assert.deepEqual(actual, expected, [message]) // should(actual).eql(expected, [message])
	assert.notDeepEqual(actual, expected, [message]) // should(actual).not.eql(expected, [message])
	assert.strictEqual(actual, expected, [message]) // should(actual).equal(expected, [message])
	assert.notStrictEqual(actual, expected, [message]) // should(actual).not.equal(expected, [message])
	assert.throws(block, [error], [message]) // should(block).throw([error])
	assert.doesNotThrow(block, [message]) // should(block).not.throw([error])
	assert.ifError(value) // should(value).Error (to check if it is error) or should(value).not.ok (to check that it is falsy)
 */


var main = require('../main');
var should = require('should');

describe('test/main.test.js', function () {
  it('should equal 0 when n === 0', function () {
    main.fibonacci(0).should.equal(0);
  });

  it('should equal 1 when n === 1', function () {
    main.fibonacci(1).should.equal(1);
  });

  it('should equal 55 when n === 10', function () {
    main.fibonacci(10).should.equal(55);
  });

  it('should throw when n > 10', function () {
    (function () {
      main.fibonacci(11);
    }).should.throw('n should <= 10');
  });

  it('should throw when n < 0', function () {
    (function () {
      main.fibonacci(-1);
    }).should.throw('n should >= 0');
  });

  it('should throw when n isnt Number', function () {
    (function () {
      main.fibonacci('呵呵');
    }).should.throw('n should be a Number');
  });
});

/*
传说中的测试驱动开发：
	先把要达到的目的都描述清楚，然后让现有的程序跑不过 case，再修补程序，让 case 通过。
 */


/*
安装一个 istanbul : $ npm install istanbul -g

执行 $ istanbul cover %APPDATA%/npm/node_modules/mocha/bin/_mocha -- -R spec

这会比直接使用 mocha 多一行覆盖率的输出，
 */

// mocha 和 istanbul 的结合是相当无缝的，只要 mocha 跑得动，那么 istanbul 就接得进来。

/*
D:\nodejs\Nodejs_sample\nodejsHello>istanbul cover %APPDATA%/npm/node_modules/mo
cha/bin/_mocha -- -R spec


  test/main.test.js
    √ should equal 55 when n === 10
    √ should 5 > 4
    √ should foobar startWith foo

  test/main.test.js
    √ should equal 0 when n === 0
    √ should equal 1 when n === 1
    √ should equal 55 when n === 10
    √ should throw when n > 10
    √ should throw when n < 0
    √ should throw when n isnt Number


  9 passing (26ms)

=============================================================================
Writing coverage object [D:\nodejs\Nodejs_sample\nodejsHello\coverage\coverage.j
son]
Writing coverage reports at [D:\nodejs\Nodejs_sample\nodejsHello\coverage]
=============================================================================

=============================== Coverage summary ===============================

Statements   : 87.5% ( 14/16 )
Branches     : 91.67% ( 11/12 )
Functions    : 100% ( 1/1 )
Lines        : 87.5% ( 14/16 )
================================================================================

 */


/*
	跑测试用例的正确方法，应该是

	$ npm i mocha --save-dev，装个 mocha 到项目目录中去
	$ ./node_modules/.bin/mocha，用刚才安装的这个特定版本的 mocha，来跑项目的测试代码。
	./node_modules/.bin 这个目录下放着我们所有依赖自带的那些可执行文件。
 */

/*
	每次输入这个很麻烦对吧？所以我们要引入 Makefile，让 Makefile 帮我们记住复杂的配置。
	
	test:
	  ./node_modules/.bin/mocha

	cov test-cov:
	  ./node_modules/.bin/istanbul cover _mocha

	.PHONY: test cov test-cov

	这时，我们只需要调用 make test 或者 make cov，就可以跑我们相应的测试了。
 */
/*
makefile关系到了整个工程的编译规则。一个工程中的源文件不计数，
其按类型、功能、模块分别放在若干个目录中，makefile定义了一系列的规则来指定，
哪些文件需要先编译，哪些文件需要后编译，哪些文件需要重新编译，甚至于进行更复杂的功能操作，
因为makefile就像一个Shell脚本一样，其中也可以执行操作系统的命令。

好处就是——“自动化编译”，
	一旦写好，只需要一个make命令，整个工程完全自动编译，极大的提高了软件开发的效率。

注意：unix下
 */