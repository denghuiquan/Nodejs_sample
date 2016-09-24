/*==============   浏览器端测试：mocha，chai，phantomjs    ====================== */
/*
vendor文件夹: 前端单元测试的环境。

vendor/tests.js 编写针对前端脚本的测试用例
 */

/*
	知识点：
		学习使用测试框架 mocha 进行前端测试 : http://mochajs.org/
		了解全栈的断言库 chai: http://chaijs.com/
		了解 headless 浏览器 phantomjs: http://phantomjs.org/

 */
/*
前端脚本的单元测试主要有两个困难需要解决。

	运行环境应当在浏览器中，可以操纵浏览器的DOM对象，且可以随意定义执行时的 html 上下文。

	测试结果应当可以直接反馈给 mocha，判断测试是否通过。
 */
/*
	//f2e 是原型生成的目录
	mocha init f2e

自动帮我们生成一个简单的测试原型
.
├── index.html
├── mocha.css
├── mocha.js
└── tests.js

	其中 index.html 是单元测试的入口，tests.js 是我们的测试用例文件
 */

/*
使用mocha-phantomjs帮助我们在命令行运行测试。

首先安装mocha-phanatomjs

npm i -g mocha-phantomjs
然后将index.html对应部分修改为

<script>
  if (window.mochaPhantomJS) { mochaPhantomJS.run(); }
  else { mocha.run(); }
</script>
然后我们在命令行中运行

mocha-phantomjs index.html
 */

/*
你也可以直接在package.json中定义

"scripts": {
  "test": "./node_modules/.bin/mocha-phantomjs vendor/index.html"
},
将mocha-phantomjs作为依赖

npm i mocha-phantomjs --save-dev
直接运行

npm test
 */


