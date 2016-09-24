/**
 * 单元测试：
 * 开发者不重视测试代码。对测试人员存在依赖，不关心自己代码的测试。
 * 倡导开发者应该啃自己的狗粮。开发者写出来的代码就是自己的产品，项目成员共同开发出来的代码会构成项目的产品。
 * 单元测试的意义在于每个测试用例的覆盖都是一种可能的承诺。API升级，测试用例向下兼容。
 * 有单元测试的质量保证，可以放心地增加和删除功能。否则就是挖东墙补西墙，到处都是坑。
 *
 * 此外，就是代码的可测试性，它是进行单元测试的前提条件。复杂的逻辑代码充满各种分支和判断，乱成麻，测试难度相当大。
 * 难以测试的一端代码最需要重构，好的代码的单元测试是轻量的。重构和写单元测试之间是一个相互促进的步骤。
 *
 * 编写测试代码原则：
 * 单一职责；
 * 接口抽象：针对接口进行测试，而具体代码实现的变化不影响为接口编写的单元测试。
 * 层次分离：通过分层可以逐层测试，逐层保证。相互间的耦合降到最小。
 *
 *
 * 单元测试主要包含：断言、测试框架、测试用例、测试覆盖率、mock、持续集成等几个方面。
 * 由于Node的特殊性，它还会加入异步代码测试和私有方法的测试。
 * 
 */

// 如何对输出结果进行测试，以确认方法调用是正常的，是最基本的测试点。
// 断言就是单元测试中用来保证最小单元是否正常的检测方法。
// Node中存在assert模块。断言用于检查程序在运行时是否满足期望。
// 断言规范最早来自于CommonJS的单元测试规范。

var assert = require('assert');
assert.equal(Math.max(1,100),100);

assert.throws(new Error());

// 一旦assert.equal()不满足期望，将会throw new assert.AssertionError({})导致整个程序停止运行。
// 没有对输出结果做任何断言检查的代码，都不是测试代码。没有测试代码的代码，都是不可依赖的代码。
// 
// 断言规范中的检测方法：
// 1) ok();是否为真。
// 2) equal();是否相等。
// 3) notEqual();
// 4) deepEqual();深度相等（对象或者数组的元素是否相等）。
// 5) notDeepEqual();
// 6) strictEqual();是否严格相等（相当于===）。
// 7) notStrictEqual();
// 8) throws();判断是否抛出异常。
// 
// Node的assert模块扩充的：
// 9) doesNotThrow();是否没有抛出异常。
// 10) ifError();判断实际值是否为一个假值（null、undefined、0、''、false）,
// 
// 
// 社区的模块中，should.js断言库就是基于assert模块进行封装的。


/**
 * 测试框架：
 * 抛出异常对于大规模断言检测并不友好，更通用的做法是：记录下抛出的异常并继续执行，最后生成测试报告。
 * 这些任务的承担者就是测试框架。
 *
 * 测试框架用于为测试服务，本身并不参与测试，主要用于管理测试用例和生成测试报告，以提升测试用例的开发速度，提高测试用例的可维护性和可读性，以及一些周边性工作。
 *
 * mocha是Node社区明星开发者TJHolowaychuk开发的一款优秀的单元测试框架。
 */
/**
 * 测试风格：
 * 主要有TDD（测试驱动开发）和BDD（行为驱动开发）。
 * 差别：1）关注点不同：TDD关注所有功能是否被正确实现，每个功能都具备对应的测试用例；
 * BDD关注整体行为是否符合预期，适合自顶向下的设计方式。
 * 2）表达方式不同：TDD的表达方式偏向于功能说明书的风格；BDD的表达方式更接近于自然语言的习惯。
 *
 * mocha对于两种风格都有支持。
 */

require('mocha');
// BDD风格
describe('Array',function(){
	before(function(){
		// ...
	});

	describe('#indexOf()',function(){
		it('should return -1 when not present',function(){
			[1,2,3].indexOf(4).should.equal(-1);
		});
	});
});

// BDD对测试用例的组织主要采用describe和it进行组织。
// deecribe可以描述多层级的结构，具体到测试用例时，用it。
// 另外，mocha还提供了before、after、beforeEach、和afterEach这个钩子方法，用于协助describe中测试用例的准备、安装、卸载和回收等工作。

// TDD风格
suite('Array',function(){
	setup(function(){
		// ...
	});

	suite('#indexOf()',function(){
		test('should return -1 when not present',function(){
			assert.equal([1,2,3].indexOf(4),-1);
		});
	});
});

// TDD对测试用例的组织主要采用suite和test来完成。
// suite也可以描述多层级的结构，具体到测试用例时，用test。
// 另外，mocha还提供了setup和teardown这个钩子方法。


/**
 * 测试报告:
 * mocha设计的十分灵活，它与断言之间并不耦合，使得具体的测试用例既可以采用assert原生模块，也可以采用扩展的断言库，如should.js、expect和chai等。
 * 但无论采用那个断言库，运行测试用例后，测试报告使开发者和质量管理着都关注的东西。
 *
 *
 * mocha提供了相当丰富的报告格式，调用mocha --reporters即可查看所有的报告格式。
 */

/**
 * 测试用例：
 * 一个测试用例中包含至少一个断言。
 *
 * 1）测试用例最少需要通过正向测试和反向测试来保证测试对功能的覆盖，这是最基本的测试用例。
 *
 * 2）异步测试：由于Node环境的特殊性，需要特别注意异步代码的测试。
 * node中，检查方法的返回值毫无意义，并且不知道回调函数具体何时调用结束，这将导致我们在对异步调用进行测试时，无法调度后续测试用例的执行。
 *
 * 所幸的事，mocha解决了这个问题。
 * 
 */
it('fs.readFile should be ok',function(done){
	fs.readFile('file_path','utf-8',function(err,data){
		should.not.exist(err);
		done();
	});
});

// 上面的代码中，测试用例方法it()接受两个参数；用例标题和回调函数。
// 通过检查这个回调函数的形参长度来判断这个用例是否异步调用，如果是异步调用，在执行测试用例时，会将一个函数done()注入为实参，测试代码需要主动调用这个函数通知测试框架当前测试用例执行完成，然后测试框架才进行下一个测试用例的执行。跟尾触发类似。

/**
 * 超时设置：
 * 异步测试带来的问题主要在于回调函数执行的时间无从预期。上面例子中，我们无法知道done()具体在什么时间执行。
 * 这是可以添加超时限制，如果一个用例的执行时间超过了预期时间，将会记录下一个超时错误，然后执行下一个测试用例。
 * 
 */
describe('a suite of tests', function(){
	this.timeout(500);
	it('should take less than 500ms',function(done){
		setTimeout(done,300);
	});

	it('should take less than 500ms as well',function(done){
		setTimeout(done,200);
	});
});

// mocha 的默认超时时间为2000ms。一般情况下，通过mocha -t <ms>设置所有用例的超时时间。若需要更细粒度地设置超时时间，可以在测试用例it中调用this.timeout(ms)实现对单个用例的特殊设置。
// this.timeout(ms)设置描述下当前层级的所有用例。



/**
 * 测试覆盖率：
 * 不同的测试用例将会不断地覆盖代码的分支和不同的情况。测试覆盖率是单元测试中的一个重要的指标，它能够概括地给出整体的覆盖率，明确地统计到行的覆盖情况。
 *
 * 可以用到jscover模块。
 *
 * blanket模块。
 */

/**
 * mock:
 * 模拟异常不是一个小科目：推荐使用muk模块。
 * 为解决呈现文件系统异常的高成本问题，我们伪造fs.readFileSync()方法抛出错误来触发异常。同时为了不影响其余用例，我们需要在执行完后还原它。、为此before和after钩子函数派上用场了。
 * 
 */
describe('getContent',function(){
	var _readFileSync;
	before(function(){
		_readFileSync = fs.readFileSync;
		fs.readFileSync = function(filename,encoding){
			throw new Error('mock readFileSync error');
		};
	});

	// it();
	
	after(function(){
		fs.readFileSync = _readFileSync;
	});
});

/**
 * [使用muk]
 * @author Denmark
 */
var fs = require('fs');
var muk= require('muk');

before(function(){
	muk(fs,'readFileSync', function(filename,encoding){
		throw new Error('mock readFileSync error');
	});
});

// it();
// it();
// it();

after(function(){
	muk.restore();
});



// 值得注意的是，异步方法的模拟，需要十分小心是否将异步方法模拟为同步。
// 正确的mock方式是尽量让mock后的行为与原始行为保持一致。
fs.readFile = function(filename, encoding, callback){
	process.nextTick(function(){
		callback(new Error('mock readFile Error'));
	});
};
// 模拟异步方法时，我们调用Process.nextTick()使得回调方法能够异步执行即可。



/**
 * 私有方法的测试：只有挂载在exports或module.exports上的变量或方法才可以被外部通过require引入访问，其余方法只能在模块内部被调用和访问。
 * rewire模块提供了一种巧妙的方式实现对私有方法的访问。
 * rewire的调用方式与require十分类似。
 *
 * rewire的诀窍在于它引入文件时，像require一样对原始文件做了一定的手脚。除了添加(function(exports,require,module,__filename,__dirname){和});的头尾包装外，
 * 
 * 它还注入了部分代码，具体如下所示：
 * (function(exports,require,module,__filename,__dirname){
		var method = function(){};
		exports.__set__ = function(name, value){
			eval(name " = " value.toString());
		};

		exports.__get__ = function(name){
			return eval(name);
		};
	});

 *	所以每一个被rewire引入的模块都有__set__()和__get__()方法。
 *	巧妙地利用了闭包的诀窍，在eval()执行时，实现了对模块内部局部变量的访问，从而可以将局部变量导出给测试用例执行。
 */
// Eg:
var limit = function(num){
	return num<0?0:num;
};

// 测试用例：
it('limit should return success', function(){
	var lib = rewire('../lib/index.js');
	var limit = lib.__get__('limit');
	limit(10).should.be.equal(10);
});



/**
 * 测试工程化与自动化：
 *
 * 利用工具进行持续集成测试，使得测试工程化自动化，以减少人工成本。
 *
 * Node在*nix系统下，可以利用成熟的工具：其中Makefile比较小巧灵活，适合用来构建工程。
 * 常用的Makefile文件内容格式如下：
 * 
  	TESTS = test/*.js
	REPORTER = spec
	TIMEOUT = 10000
	MOCHA_OPTS = 
	test:
		@NODE_NEW=test ./node_modules/mocha/bin/mocha \
		--reporter $(REPORTER) \
		--timeout $(TIMEOUT) \
		$(MOCHA_OPTS) \
		$(TESTS)

	test-cov:
		@$(MAKE) test MOCHA_OPTS='--require blanket' REPORTER=html-cov > coverage.html

	test-all: test test-cov

	.PHONY: test


 *	这样以来，开发者改动代码后，只需要通过make test和make test-cov命令即可执行复杂的单元测试和覆盖率。	
 *
 * 但有两点需要注意：
 * Makefie文件的缩进必须是tab符号，不能用空格。
 * 记得在包描述文件中配置blanket.
 *
 */
/**
 * 持续集成：
 * 利用travis-ci:
 * 其弥补GitHub的不足，与GitHub配合得相得益彰。
 * travis-ci除了提供状态服务外，还详细记录了每次测试的详细的测试报告和日志，通过这些信息我们可以追踪项目的迭代健康状态。
 *
 *
 * Web应用测试：Web框架的测试方式，比如Connect或Express提供了supertest辅助库来简化单元测试的编写。
 */