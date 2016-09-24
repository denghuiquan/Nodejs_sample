
// 安装依赖的命令： npm install --save packsge_name

/*=======================  Hello World   ===================*/
/*// 这句的意思就是引入 `express` 模块，并将它赋予 `express` 这个变量等待使用。
var express = require('express');
// 调用 express 实例，它是一个函数，不带参数调用时，会返回一个 express 实例，将这个变量赋予 app 变量。
var app = express();

// app 本身有很多方法，其中包括最常用的 get、post、put/patch、delete，在这里我们调用其中的 get 方法，为我们的 `/` 路径指定一个 handler 函数。
// 这个 handler 函数会接收 req 和 res 两个对象，他们分别是请求的 request 和 response。
// request 中包含了浏览器传来的各种信息，比如 query 啊，body 啊，headers 啊之类的，都可以通过 req 对象访问到。
// res 对象，我们一般不从里面取信息，而是通过它来定制我们向浏览器输出的信息，比如 header 信息，比如想要向浏览器输出的内容。这里我们调用了它的 #send 方法，向浏览器输出一个字符串。
app.get('/', function (req, res) {
  res.send('Hello World');
});

// 定义好我们 app 的行为之后，让它监听本地的 3000 端口。这里的第二个函数是个回调函数，会在 listen 动作成功后执行，我们这里执行了一个命令行输出操作，告诉我们监听动作已完成。
app.listen(3000, function () {
  console.log('app is listening at port 3000');
});*/

/*=================================== 第一个相对完整的App =======================*/
/*第一个相对完整的App*/
/*// 引入依赖
var express = require('express');
var utility = require('utility');

// 建立 express 实例
var app = express();

app.get('/', function (req, res) {
  // 从 req.query 中取出我们的 q 参数。
  // 如果是 post 传来的 body 数据，则是在 req.body 里面，不过 express 默认不处理 body 中的信息，需要引入 https://github.com/expressjs/body-parser 这个中间件才会处理，这个后面会讲到。
  // 如果分不清什么是 query，什么是 body 的话，那就需要补一下 http 的知识了
  if (req.query.q==undefined) {
  	res.send("please send with your query code!");
  }else{
  	var q = req.query.q;

  var code=req.query.code;
  // 调用 utility.md5 方法，得到 md5 之后的值
  // 之所以使用 utility 这个库来生成 md5 值，其实只是习惯问题。每个人都有自己习惯的技术堆栈，
  // 我刚入职阿里的时候跟着苏千和朴灵混，所以也混到了不少他们的技术堆栈，仅此而已。
  // utility 的 github 地址：https://github.com/node-modules/utility
  // 里面定义了很多常用且比较杂的辅助方法，可以去看看
  var encodevalue="";
  if (code=="md5") {
  	 encodevalue= utility.md5(q);
  }else if(code=="sha1"){
     encodevalue= utility.sha1(q);
  }else{
  	encodevalue="used the encoding MD5:"+utility.md5(q);
  };  

  res.send(encodevalue);
  };
});  
app.listen(3000, function (req, res) {
  console.log('app is running at port 3000');
});*/



/*================================ 网络爬虫App ==========================*/

/*  注意：有 rate limit 的限制的网站不行*/
/*当在浏览器中访问 http://localhost:3000/ 时，
输出 CNode(https://cnodejs.org/ ) 社区首页的所有
帖子标题和链接，以 json 的形式。*/
/*
	1)学习使用 superagent 抓取网页
	2)学习使用 cheerio 分析网页
 */

/*需要用到三个依赖，分别是 express，superagent 和 cheerio */
/*// 引入依赖
var express = require('express');
var utility = require('utility');
var superagent=require('superagent');
var cheerio=require('cheerio');

// 建立 express 实例
var app = express();
app.get('/', function (req, res, next) {
  // 用 superagent 去抓取 https://cnodejs.org/ 的内容
  superagent.get('https://cnodejs.org/')
    .end(function (err, sres) {
      // 常规的错误处理
      if (err) {
        return next(err);
      }
      // sres.text 里面存储着网页的 html 内容，将它传给 cheerio.load 之后
      // 就可以得到一个实现了 jquery 接口的变量，我们习惯性地将它命名为 `$`
      // 剩下就都是 jquery 的内容了
      var $ = cheerio.load(sres.text);
      var items = [];
      $('#topic_list .topic_title').each(function (idx, element) {
        var $element = $(element);
        var $user_avatar=$(this.parent.parent).find(".user_avatar");
        var $author_img=$user_avatar.find("img");
        items.push({
          title: $element.attr('title'),
          href: $element.attr('href'),
          author: $author_img.attr('title')
        });
      });
      var doc="<!DOCTYPE html><head><meta charset='utf-8'><title>Node.js 制作的网络爬虫案例</title></head><body style='background-color:#ccc'><div style='margin-left:10%;width:80%'><h1 style='margin-bottom:20px'>从<a href='https://cnodejs.org'><strong><em>cnodejs</em></strong></a>论坛首页爬回来的文章</h1>";
      for (var i =0; i <= items.length - 1; i++) {
      	doc+="<div  style='margin-top:20px'><strong>" +(i+1)+" ：</strong><a style='text-decoration:none' href='https://cnodejs.org"+items[i].href+"'>"+ items[i].title+"</a><span style='margin-left:20px'>作者："+ items[i].author+"</span></div>";
      };
      doc+="</div></body>";
      res.send(doc);
    });
});


app.listen(3000, function (req, res) {
  console.log('app is running at port 3000');
});

*/

/*============================== Node.js 最牛逼的地方——异步并发的内容===========================*/

/*使用 eventproxy 控制并发*/

//目标：输出 CNode(https://cnodejs.org/ ) 社区首页的所有主题的标题，链接和第一条评论，以 json 的格式。
/*
	0、体会 Node.js 的 callback hell 之美
	2、学习使用 eventproxy 这一利器控制并发

	需要用到三个库：superagent cheerio eventproxy(https://github.com/JacksonTian/eventproxy )
 */

/*
	需要取出每个主题的第一条评论，这就要求我们对每个主题的链接
发起请求，并用 cheerio 去取出其中的第一条评论。
后者的 40 个请求，我们并发地发起，而且不会遇到多线程啊锁什么的，
Node.js 的并发模型跟多线程不同，抛却那些观念。
 */


/*// 引入依赖
// var express = require('express');
// var utility = require('utility');
var superagent=require('superagent');
var cheerio=require('cheerio');
var eventproxy = require('eventproxy');

// url 模块是 Node.js 标准库里面的
// http://nodejs.org/api/url.html
var  url = require('url');
var cnodeUrl = 'https://cnodejs.org/?tab=all&page=2'
var baseUrl = 'https://cnodejs.org/';

// 用 superagent 去抓取 https://cnodejs.org/ 的内容
superagent.get(cnodeUrl)
.end(function (err, sres) {
  // 常规的错误处理
  if (err) {
    return console.error(err);
  }
  // sres.text 里面存储着网页的 html 内容，将它传给 cheerio.load 之后
  // 就可以得到一个实现了 jquery 接口的变量，我们习惯性地将它命名为 `$`
  // 剩下就都是 jquery 的内容了
  var topicUrls = [];
  var $ = cheerio.load(sres.text);

  //获取请求页面所有的连接
  $('#topic_list .topic_title').each(function (idx, element){
  	var $element=$(element);
  	// $element.attr('href') 本来的样子是 /topic/542acd7d5d28233425538b04
	// 我们用 url.resolve 来自动推断出完整 url，变成
	// https://cnodejs.org/topic/542acd7d5d28233425538b04 的形式
	// 具体请看 http://nodejs.org/api/url.html#url_url_resolve_from_to 的示例

	var href = url.resolve(baseUrl, $element.attr('href'));
	topicUrls.push(href);
  });

  // console.log(topicUrls);

  // 得到 topicUrls 之后
  // 需要用到 eventproxy 的 #after API
  
  // 得到一个 eventproxy 的实例
  var ep = new eventproxy();
  // 命令 ep 重复监听 topicUrls.length 次（在这里也就是 40 次） `topic_html` 事件再行动
  
  ep.after('topic_html', topicUrls.length, function (topics) {
	// topics 是个数组，包含了 40 次 ep.emit('topic_html', pair) 中的那 40 个 pair

	// 开始行动
	topics = topics.map(function (topicPair) {
	  // 接下来都是 jquery 的用法了
	  var topicUrl = topicPair[0];
	  var topicHtml = topicPair[1];
	  var $ = cheerio.load(topicHtml);
	  return ({
	    title: $('.topic_full_title').text().trim(),
	    href: topicUrl,
	    comment1: $('.reply_content').eq(0).text().trim(),
	  });
	});
	console.log('final:');
  	console.log(topics);
  });

  topicUrls.forEach(function (topicUrl) {
	 superagent.get(topicUrl)
	   .end(function (err, res) {
	     console.log('fetch '+topicUrls.indexOf(topicUrl)+" " + topicUrl + ' successful');
	     ep.emit('topic_html', [topicUrl, res.text]);
	   });
  });
});
*/

/*
如果你要并发异步获取两三个地址的数据，并且要在获取到数据之后，对这些数据一起进行利用的话，常规的写法是自己维护一个计数器。

先定义一个 var count = 0，然后每次抓取成功以后，就 count++。
每次当抓取成功的时候，就判断一下 count === topicUrls.length;
当值为真时，使用另一个函数继续完成操作。
 */
/*
// 参考 jquery 的 $.get 的方法
//先获取 data1，获取完成之后获取 data2，然后再获取 data3，然后 fuck 它们，进行输出。
$.get("http://data1_source", function (data1) {
  // something
  $.get("http://data2_source", function (data2) {
    // something
    $.get("http://data3_source", function (data3) {
      // something
      var html = fuck(data1, data2, data3);
      render(html);
    });
  });
});
*/


/*
	其实这三个源的数据，是可以并行去获取的，
	data2 的获取并不依赖 data1 的完成，
	data3 同理也不依赖 data2
 */
// 用计数器来写，会写成这样
/*
(function () {
  var count = 0;
  var result = {};

  $.get('http://data1_source', function (data) {
    result.data1 = data;
    count++;
    handle();
    });
  $.get('http://data2_source', function (data) {
    result.data2 = data;
    count++;
    handle();
    });
  $.get('http://data3_source', function (data) {
    result.data3 = data;
    count++;
    handle();
    });

  function handle() {
    if (count === 3) {
      var html = fuck(result.data1, result.data2, result.data3);
      render(html);
    }
  }
})();
*/

/*---------------------------------------------------------*/
/* 用 eventproxy，写出来是这样的 
	也就是个高等计数器

	监听了三个事件，分别是 data1_event, data2_event, data3_event，
	每次当一个源的数据抓取完成时，
	就通过 ep.emit() 来告诉 ep 自己，某某事件已经完成了。

	当三个事件未同时完成时，ep.emit() 调用之后不会做任何事；
	当三个事件都完成的时候，就会调用末尾的那个回调函数，
	来对它们进行统一处理。
*/

/*
var ep = new eventproxy();
ep.all('data1_event', 'data2_event', 'data3_event', function (data1, data2, data3) {
  var html = fuck(data1, data2, data3);
  render(html);
});

$.get('http://data1_source', function (data) {
  ep.emit('data1_event', data);
});

$.get('http://data2_source', function (data) {
  ep.emit('data2_event', data);
});

$.get('http://data3_source', function (data) {
  ep.emit('data3_event', data);
});
*/

/* 并发和嵌套的问题虽然解决了，但老祖宗们消灭了几十年的 goto 语句又回来了。 */
/*
	最最常用的用法就是以上的这种，即：

	1) 先 var ep = new eventproxy(); 得到一个 eventproxy 实例。
	2) 告诉它你要监听哪些事件，并给它一个回调函数。ep.all('event1', 'event2', function (result1, result2) {})。
	3) 在适当的时候 ep.emit('event_name', eventData)。
 */




/*=============================   使用 async 控制并发  =================================== */

// 目标：输出 CNode(https://cnodejs.org/ ) 社区首页的所有主题的标题，链接和第一条评论，以 json 的格式。

// 并发连接数需要控制在 5 个
// 原因：
// 一次性发了 40 个并发请求出去，要知道，除去 CNode 的话，
// 别的网站有可能会因为你发出的并发连接数太多而当你是在恶意请求，把你的 IP 封掉。

/* 
   知识要点：
	1、学习 async(https://github.com/caolan/async ) 的使用。这里有个详细的 async demo 演示：https://github.com/alsotang/async_demo
	2、学习使用 async 来控制并发连接数。

	 async 的 mapLimit(arr, limit, iterator, callback) 接口
	 常用的控制并发连接数的接口是 queue(worker, concurrency)

  什么时候用 eventproxy，什么时候使用 async 呢？
	 --当你需要去多个源(一般是小于 10 个)汇总数据的时候，用 eventproxy 方便；
	 --当你需要用到队列，需要控制并发数，或者你喜欢函数式编程思维时，使用 async。
 */


/*
fetchUrl('http://www.baidu.com', function (err, content) {
  // do something with `content`
});
*/
// 调用它时，它会返回 http://www.baidu.com 的页面内容回来。
// 返回内容是假的，返回延时是随机的。并且在它被调用时，会告诉你它现在一共被多少个地方并发调用着。

var async=require('async');

// 并发连接数的计数器
var concurrencyCount = 0;
var fetchUrl = function (url, callback) {
  // delay 的值在 2000 以内，是个随机的整数
  var delay = parseInt((Math.random() * 10000000) % 2000, 10);
  concurrencyCount++;
  console.log('现在的并发数是', concurrencyCount, '，正在抓取的是', url, '，耗时' + delay + '毫秒');
  setTimeout(function () {
    concurrencyCount--;
    callback(null, url + ' html content');
  }, delay);
};

// 伪造一组链接  https://cnodejs.org/?tab=all&page=i
var urls = [];
for(var i = 1; i <= 30; i++) {
  urls.push('http://cnodejs.org/?tab=all&page=' + i);
}
// 检查构造的链接
// console.log(urls);

// 使用 async.mapLimit 来并发抓取，并获取结果
async.mapLimit(urls, 5, function (url, callback) {
  fetchUrl(url, callback);
}, function (err, result) {
  console.log('final:');
  console.log(result);
});


/*
// 建立 express 实例
var app = express();
app.get('/', function (req, res, next) {  
});


app.listen(3000, function (req, res) {
  console.log('app is running at port 3000');
});
*/


