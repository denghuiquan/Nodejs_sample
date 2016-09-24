var routes = [];

var use = function(path,action){
	routes.push([path,action]);
}

function(req,res){
	var pathname=url.parse(req.url).pathname;
	for (var i = routes.length - 1; i >= 0; i--) {
		var route= routes[i];
		if (pathname===route[0]) {
			var action = route[1];
			action(req,res);
			return;
		};
	};
	handle404(req,res);
};

use('/url1',action1); 
use('/url2',action1); 
use('/url2/suburl',action1); 
