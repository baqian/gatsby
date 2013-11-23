var fs = require('fs'),
    hogan = require('hogan.js');

// hogan和mustache模版语法差不多
exports.renderer = function renderer(path, options, fn) {
  fs.readFile(path, 'utf8', function (err, template) {
    if (err) {
      return fn(err);
    }

    try {
      var compiled = exports.templates[path];
      if (!compiled) {
        compiled = exports.templates[path] = hogan.compile(template);
      }

      fn(null, compiled.render(options));
    } catch (error) {
      fn(error);
    }
  });
};

exports.templates = {};
