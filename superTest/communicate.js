
/*var worker = new Worker('worker.js');
worker.onmessage = function(event){
	document.getElementById('result').textContent = event.data;
}*/

// sub.js
process.on('message',function(m){
	console.log('child got message:',m);
});

process.send({foo:'bar'});