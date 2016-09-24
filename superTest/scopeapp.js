/*================================  作用域与闭包：this，var，(function () {})  ===============================*/

/*
知识点

	理解 js 中 var 的作用域
	了解闭包的概念
	理解 this 的指向
 */

/*
// var 作用域
// 
var parent = function () {
  var name = "parent_name";
  var age = 13;

  var child = function () {
    var name = "child_name";
    var childAge = 0.3;

    // => child_name 13 0.3
    console.log(name, age, childAge);
  };

  child();

  // will throw Error
  // ReferenceError: childAge is not defined
  console.log(name, age, childAge);
};

parent();

// 内部函数可以访问外部函数的变量，外部不能访问内部函数的变量。
*/


// 如果忘记var，那么变量就被声明为全局变量了
/*
	在 Node 中，全局变量会被定义在 global 对象下；
	在浏览器中，全局变量会被定义在 window 对象下。
 */
/*
function foo() {
  value = "hello";
  var NIHAO="NIHAO";
}
foo();
console.log(value); // 输出hello
console.log(global.value); // 输出hello
console.log(global.NIHAO) // 输出undifined
*/

/*
// 如果你确实要定义一个全局变量的话，请显示地定义在 global 或者 window 对象上
function foo() {
  global.newvar = "hello";  
}
foo();
console.log(newvar); // 输出hello
console.log(global.newvar); // 输出hello
*/

/*
// JavaScript 中，变量的局部作用域是函数级别的。
// 不同于 C 语言, JavaScript 中没有块级作用域。
function foo() {
  for (var i = 0; i < 10; i++) {
    var value = "hello world";
  }
  console.log(i); //输出10
  console.log(value);//输出hello world
}
foo();

// 解决建议：在函数体的顶部声明可能用到的变量，这样就可以避免出现一些奇奇怪怪怪的 bug。
// 不过，一般都是现用现声明的，这类错误的检测交给 jshint 来做就好了
*/

/*============  闭包  ==========*/
/*
	闭包：简单的说，就是使内部函数可以访问定义在外部函数中的变量。
 */
// 构造了一个名为 adder 的构造器，传入参数，并在内部新建var来指向使用该参数
/*
var adder = function (x) {
  var base = x;
  return function (n) {
    return n + base;
  };
};

var add10 = adder(10);//x=10==>base=10;  ====>return function (n) {    return n + 10;  };
console.log(add10(5));

var add20 = adder(20);
console.log(add20(55));

console.log((adder(55))(23));
*/
/*
每次调用 adder 时，adder 都会返回一个函数给我们。
我们传给 adder 的值，会保存在一个名为 base 的变量中。
由于返回的函数在其中引用了 base 的值，于是 base 的引用计数被 +1。
当返回函数不被垃圾回收时，则 base 也会一直存在。
 */

/*===== 闭包的一个坑 ========*/
/*
for (var i = 0; i < 5; i++) {
  setTimeout(function () {
    console.log(i);
  }, 0);
}
*/
/*
因为 setTimeout 中的 i 是对外层 i 的引用。当 setTimeout 的代码被解释的时候，
运行时只是记录了 i 的引用，而不是值。而当 setTimeout 被触发时，五个 setTimeout 中的 i 同时被取值，
由于它们都指向了外层的同一个 i，而那个 i 的值在迭代完成时为 5，所以打印了五次 5。
 */

/*===  为了得到我们预想的结果，我们可以把 i 赋值成一个局部的变量，从而摆脱外层迭代的影响。 ===*/
/*
for (var i = 0; i < 5; i++) {
  (function (idx) {
    setTimeout(function () {
      console.log(idx);
    }, 5);
  })(i);
}
*/
/*
// or 
var forx=function (idx) {
  setTimeout(function () {
    console.log(idx);
  }, 5);
}
for (var i = 0; i < 5; i++) {
  forx(i);
}

*/


/*===========================  面向对象编程 =================================*/
/*
function Base() {
    this.id = "base"
}
Base.prototype.toString = function() {
    return this.id;
}
function Derive(id) {
    this.id = id;
}
Derive.prototype = new Base();
Derive.prototype.test = function(id){
    return (this.id === id) +":"+this.id+"==="+id;
}
var newObj = new Derive("derive");

console.log( "Base.toString():"+Base.toString());
console.log("(new Base).toString():"+ (new Base).toString());
console.log( "Derive.toString():"+Derive.toString());

console.log( "newObj.toString():"+newObj.toString());

console.log( "newObj.test('derive'):"+ newObj.test("derive"));
console.log(  "newObj.test(newObj.toString()):"+ newObj.test(newObj.toString()));
*/


/*===================  this   =================*/

/*在函数执行时，this 总是指向调用该函数的对象。
要判断 this 的指向，其实就是判断 this 所在的函数属于谁。*/

/*
this 出现的场景分为四类：
	-1- 有对象就指向调用对象
	-2- 没调用对象就指向全局对象
	-3- 用new构造就指向新对象
	-4- 通过 apply 或 call 或 bind 来改变 this 的所指。
 */
/*---------- 1）函数有所属对象时：指向所属对象 ------*/
/*
var myObject = {value: 100};
myObject.getValue = function () {
  console.log(this.value);  // 输出 100

  // 输出 { value: 100, getValue: [Function] }，
  // 其实就是 myObject 对象本身
  console.log(this);

  return this.value;
};

console.log(myObject.getValue()); // => 100
// getValue() 属于对象 myObject，并由 myOjbect 进行 . 调用，因此 this 指向对象 myObject。
// */


/*---------------2) 函数没有所属对象：指向全局对象----------------*/
/*
var myObject = {value: 100};
myObject.getValue = function () {
  var foo = function () {
    console.log(this.value) // => undefined
    console.log(this);// 输出全局对象 global
  };

  foo();

  return this.value;
};

console.log(myObject.getValue()); // => 100
*/
/*  据说是设计错误：
foo 函数虽然定义在 getValue 的函数体内，但实际上它既不属于 getValue 也不属于 myObject。
foo 并没有被绑定在任何对象上，所以当调用时，它的 this 指针指向了全局对象 global
 */

/*--------3）构造器中的 this：指向新对象---------*/
/*
var SomeClass = function(){
  this.value = 100;
}

var myCreate = new SomeClass();

console.log(myCreate.value); // 输出100

*/
// 在 js 中，构造函数、普通函数、对象方法、闭包，这四者没有明确界线。界线都在人的心中。


/*--------4) apply 和 call 调用以及 bind 绑定：指向绑定的对象---------*/
/*apply() 方法接受两个参数第一个是函数运行的作用域，另外一个是一个参数数组(arguments)。

call() 方法第一个参数的意义与 apply() 方法相同，只是其他的参数需要一个个列举出来。

简单来说，call 的方式更接近我们平时调用函数，
而 apply 需要我们传递 Array 形式的数组给它。它们是可以互相转换的。*/

var myObject = {value: 100};

var foo = function(n){
	var arg=n;
  console.log(this);
  console.log("参数："+arg);
};

foo(); // 全局变量 global
foo.apply(myObject,['arguments']); // { value: 100 }
foo.call(myObject,'err'); // { value: 100 }

var newFoo = foo.bind(myObject);
newFoo(); // { value: 100 }

