
var hogan = require('./lib/hogan.js'),
	jsbin = require('./jsbin'),
	mocky = require('./mocky'),
	hao321 = require('./hao321');

hogan.renderer('./src/global/header.html', null, function(){});
hogan.renderer('./src/global/footer.html', null, function(){});


 jsbin.connect();
// mocky.connect();
hao321.connect();