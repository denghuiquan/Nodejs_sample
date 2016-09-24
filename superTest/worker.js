/*var n=1;
search:while(true){
	n+=1;
	for (var i = 0; i < Math.sqrt(n); i++) {
		if (n%2==0) {
			continue search;
		};
		postMessage(n);
	};
}*/

// parent.js
var cp =require('child_process');
var n= cp.fork(__dirname+'/communicate.js');
n.on('message',function(m){
	console.log('parent got massage:',m);
});

n.send({hello:'world'});
