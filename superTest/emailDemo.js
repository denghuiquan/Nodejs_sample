/**
 * npm i nodemailer@0.7.1
 */
/*var nodemailer= require('nodemailer');

// 建立一个SMTP传输连接
var smtpTransport = nodemailer.createTransport('SMTP', {
	service : "QQ",
	auth:{
		user:"980352129@qq.com",
		pass:""
	}
});

// 邮件选项
var mailOptions = {
	from:"Denmark♂ <denghuiquan@hehe.com>",
	to:"denghuiquan@qq.com,980352129@qq.com",
	subject:"hello world!mailDemo test...",
	text:"hello world!",
	html:"<h2>hello world!</h2>"
};


// 发送邮件
smtpTransport.sendMail(mailOptions, function(err, res){
	if (err) {
		console.log(err);
	} else{
		console.log("message sent: "+res.message);
	};
});*/



var nodemailer = require('nodemailer');

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'huiquan1993@gmail.com',
        pass: ''
    }
});

// NB! No need to recreate the transporter object. You can use
// the same transporter object for all e-mails

// setup e-mail data with unicode symbols
var mailOptions = {
    from:"Denmark♂ <denghuiquan@hehe.com>",
	to:"denghuiquan@qq.com,980352129@qq.com",
	subject:"hello world!mailDemo test...",
	text:"hello world!",
	html:"<h2>hello world!</h2>"
};

// send mail with defined transport object
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }
    console.log('Message sent: ' + info.response);

});