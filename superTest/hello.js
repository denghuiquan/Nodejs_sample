var hello=require("paicong_npm_publish_test");
hello();



/*var http = require('http');
http.createServer(function (req,res) {
  // body...
  res.writeHead(200,{'Content-Type':'text/plain'});
  res.end("hello!world.");
}).listen(8888,"127.0.0.1");
console.info("Server running at http://127.0.0.1:8888/");*/



var http = require('http');
var url= require('url');
var fs= require('fs');
var path= require('path');
var querystring= require('querystring');

var update= function(req,res){
  console.info("req.method:POST");
};
var remove= function(req,res){
  console.info("req.method:DELETE");
};
var create= function(req,res){
  console.info("req.method:PUT");
};
var get= function(req,res){
  console.info("req.method:GET");
};
var dealSwitch= function(req,res){
  switch(req.method){
    case 'POST':update(req,res);
    break;
    case 'DELETE':remove(req,res);
    break;
    case 'PUT':create(req,res);
    break;
    case 'GET':get(req,res);
    break;
    default:get(req,res);
  }
};

var handles = {
  controller:function (argument) {
    console.info(argument.toString());
  },
  index:function (argument) {
    console.info(argument.toString());
  },
};

/*基于Cookie实现用户和数据的映射：
一旦服务器启用了Session，它将约定一个键值作为Session的口令，这个值可以随意约定，
比如Connect默认采用Connect_uid,Tomcat采用jsessionid等；
服务器检查到用户请求Cookie中没有携带该值，就会为之生成一个值，这个值是唯一且不重复的，并设定超时时间*/
var  sessions = {};
var key ="session_id";
var Expires=20*60*100;//20分钟有效时间

var serialize = function(name,val,options){
  var pairs= [name+'='+encode(val)];
  options = options||{};
  if (options.maxAge) pairs.push('Max-Age='+options.maxAge);
  if (options.domain) pairs.push('Domain='+options.domain);
  if (options.path) pairs.push('Path='+options.path);
  if (options.expires) pairs.push('Expires='+options.expires.toUTCString());
  if (options.httpOnly) pairs.push('HttpOnly');
  if (options.secure) pairs.push('Secure');

  return pairs.join('; ');
}

var generate= function(){
  var session= {};
  session.id=(new Date()).getTime()+Math.random();
  session.cookie = {
    expire:(new Date()).getTime()+Expires
  };
  sessions[session.id]=session;
  return session;
}



/*第二种：通过查询字符串来实现浏览器和服务器段数据的对应*/
// 原理：检查请求的查询字符串，如果没有值，会先生成新的带值的URL
var getURL=function(_url,key,value){
  var obj= url.parse(_url,true);
  obj.query[key]=value;
  return url.format(obj);
}

var ayncByUrlsession_id=function(req,res){
  var redirect = function(url){
    res.setHeader('Location',url);
    res.writeHead(302);
    res.end();
  };

  var id = req.query[key];
  if (!id) {
    var session = generate();
    redirect(getURL(req.url,key,session.id));
  } else{
    if (session) {
      if (session.cookie.expire >(new Date()).getTime()) {
        //更新超时时间
        session.cookie.expire= (new Date()).getTime()+Expires;
        req.session=session;
        handle(req,res);
      } else{
        //超时了，删除旧的数据，并重新生成
        delete sessions[id];
        var session=generate();
        redirect(getURL(req.url,key,session.id));        
      };
    } else{
      //如果口令过期或口令不对，重新生成session
      var session=generate();
      redirect(getURL(req.url,key,session.id));
    };
  };
}



var handle = function(req,res){

  if (!req.session.isVisit) {
    res.session.isVisit=true;
    res.writeHead(200,{'Content-Type':'text/html; charset=UTF-8'});
    res.end("欢迎第一次来到本站");
  } else{
    res.writeHead(200,{'Content-Type':'text/html; charset=UTF-8'});
    res.end("再次欢迎来到本站");
  };

}



var app = function (req,res) {
  dealSwitch(req,res);

  /*var pathname=url.parse(req.url).pathname;
  var paths= pathname.split('/');
  var action = paths[2]||'index';
  var args = paths.slice(3);

  if (handles[controller]&&handles[controller][action]) {
    handles[controller][action].apply(null,[req,res].concat(args));
  } else{
    res.writeHead(500);
    res.end("找不到响应控制器！");
  };*/

  /*
  fs.readFile(path.join("/",pathname),function(err,file){
    if (err) {
      res.writeHead(400);
      res.end("File Not Found!--404--");
      return;
    }
    res.writeHead(200,{'Content-Type':'text/plain'});
    console.info("File Content:\n"+file);
    res.end(file);  
    return;  
  });*/

  

  var query=querystring.parse(url.parse(req.url).query);
// var query=url.parse(req.url,true).query;
// foo=bar&baz=val将解析成一个JSON对象，{foo:'bar',baz='val'}
  
  console.info(query);
/*  // 获得客户端的Cookie
  var Cookies = {};
  req.headers.cookie && req.headers.cookie.split(';').forEach(function( Cookie ) {
      var parts = Cookie.split('=');
      Cookies[ parts[ 0 ].trim() ] = ( parts[ 1 ] || '' ).trim();
  });
  console.log(Cookies);*/



  /*仅仅重新生成session还不足以完成整个流程，还需要在响应给客户端时设置新的值，以便下次请求时能够对应服务器端的数据。
  这里需要HACK响应对象的writeHead()方法，在它的内部注入设置Cookie的逻辑*/
  var writeHead=res.writeHead;
  res.writeHead=function(){
    var cookies=res.getHeader('Set-Cookie');
    var session = serialize('Set-Cookie',req.session.id);
    cookies =Array.isArray(cookies)?cookies.concat(session):[cookies, session];
    res.setHeader('Set-Cookie',cookies);
    return writeHead.apply(this, arguments);
  }
/*
  var id= req.headers.cookie[key];
  if (!id) {
    req.session = generate();
  } else{
    var session = sessions[id];
    if (session) {
      if (session.cookie.expire >(new Date()).getTime()) {
        //更新超时时间
        session.cookie.expire= (new Date()).getTime()+Expires;
        req.session=session;
      } else{
        //超时了，删除旧的数据，并重新生成
        delete sessions[id];
        req.session=generate();
        
      };
    } else{
      //如果口令过期或口令不对，重新生成session
      req.session=generate();
    };
  };
*/

  ayncByUrlsession_id(req,res);


  handle(req,res);

  /*req.setEncoding("utf8");
  if (!Cookies.isVisit) {
    res.setHeader('Set-Cookie',["type=ninja", "language=javascript",'isVisit=1']);
    res.writeHead(200,{'Content-Type':'text/html; charset=UTF-8'});
    res.end("第一次啊；兄弟！hello!world.\n----querystring:"+"foo="+query.foo+"&baz="+query.baz);
    return;
  } else{
    res.setHeader('Set-Cookie',["isVisit="+(++Cookies.isVisit)]);
    res.writeHead(200,{'Content-Type':'text/plain; charset=UTF-8'});
    res.end("第"+Cookies.isVisit+"次啦；兄弟！\n");
  };*/
  

};

// cookie:
// Set-Cookie: name=value; Path=/; Expires=Sun, 23-Apr-23 09:01:35 GMT; Domain=.domain.com;
// name=value; 必须的
// Path=/; 影响cookie的路径，访问不经不匹配时不发送这个cookie。
// Expires=Sun, 23-Apr-23 09:01:35 GMT; 和Max-Age是用来告诉浏览器这个cookie何时过期。不设置则默认为0，即关闭浏览器时会丢掉这个cookie。
// Expires设置的是UTC格式的具体时间点，在服务器时间和客户端时间不匹配时会出现误差；Max-Age则是一段时间，不是具体时间点。
// Domain=.domain.com;
// HttpOnly:告知浏览器不允许通过document.cookie修改Cookie值，但可以在http请求中发送。
// Secure: 值为true时，仅在Https请求中有效。
// 
// Cookie设置不宜过多，不宜过大。

var server= http.createServer(app);
server.listen(8888);
console.info("Server running at http://localhost:8888/");



var handle = function(req,res){
  fs.stat(filename,function(err,stat){
    var lastModified = stat.mtime.toUTCString();
    if (lastModified===req.headers['if-modified-since']) {
      res.writeHead(304,"Not Modified");
      res.end();
    } else{
      fs.readFile(filename,function(err,file){
        var lastModified = stat.mtime.toUTCString();
        res.setHeader('Last-Modified',lastModified);
        res.writeHead(200,"OK");
        res.end(file);
      });
    };
  });
};




var crypto= require('crypto');
var getHash= function(str){
  var shasum = crypto.createHash('sha1');
  return shasum.update(str).digest('base64');
}

var handleReq = function(req,res){
  fs.readFile(filename,function(err,file){   

    var hash = getHash(file);
    var noneMatch=req['if-none-match'];
    if (hash==noneMatch) {
      res.writeHead(304,"Not Modified");
      res.end();
    } else{
      var expires= new Date();
      expires.setTime(expires.getTime()+10*365*24*60*60*1000);//一年内有效
      res.setHeader("Expires",expires.toUTCString());

      res.setHeader("Cache-Control","max-age="+10*365*24*60*60*1000);

      res.setHeader('ETag',hash);
      res.writeHead(200,"OK");
      res.end(file);
    };        
  });
};


// 通过报头的Transfer-Encoding或Content-Length即可判断请求中是否带有内容
var hasBody= function(req){
  return 'transfer-encoding' in req.headers||'content-length' in req.headers;
}


/*在HTTP_Parser解析报头结束后，报文内容部分会通过data事件触发，我们只需以流的方式处理即可，代码参考如下：*/
var handleData= function(req,res){
  if (hasBody(req)) {
    var buffers=[];
    req.on('data',function(chunk){
      buffers.push(chunk);
    });

    req.on('end',function(){
      req.rawBody = Buffer.concat(buffers).toString();
      handle(req,res);
    });
  } else{
    handle(req,res);
  };
};

// xml文件要用到xml2js模块
var xml2js= require('xml2js');

var parseXML=function(req,done){
  xml2js.parseString(req.rawBody,function(err,xml){
    if (err) {
      done.apply(arguments);
    }
    done.apply(arguments);
  });
};

// 基于流式处理解析报文，将接收到的文件写入到系统的临时文件夹中，并返回对应的路径
var formidable= require('formidable');

var bytes = 1024;

var handleFile= function(req,res){
  /*内存限制：限制上传文件大小*/
  var received=0;
  var len = req.handlers['content-length']?parseInt(req.headers['content-length'],10):null;
  if (len&&len>bytes) {
    res.writeHead(413);
    res.end();
    return;
  };
  // limit
  req.on('data',function(chunk){
    received+=chunk.length;
    if (received>bytes) {
      //停止接收数据，触发end()
      req.destroy();
    };
  });

  if (hasBody(req)) {
    var done==function () {
      handle(req,res);
    };

    if (mime(rea)==='application/json') {
      parseJSON(req,done);
    } else if (mime(rea)==='application/xml') {
      parseXML(req,done);
    } else if (mime(rea)==='application/form-data') {
      // parseMutipart(req,done);
      var form = new formidable.IncomingForm();
      form.parse(req,function(err,fields,files){
        req.body = fields;
        req.files = files;
        handle(req,res);
      });
    };
  } else{
    handle(req,res);
  };
}
