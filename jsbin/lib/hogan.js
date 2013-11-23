var path = require('path');
var hogan = require(path.join(process.cwd(), 'lib/hogan'));
exports.renderer = hogan.renderer;
exports.templates = {};
