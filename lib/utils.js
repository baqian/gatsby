var fs = require('fs'),
    path = require('path'),
    crypto = require('crypto'),
    extend = require('soak').mixin,
    inherit = require('soak').inherit,
    EventEmitter = require('events').EventEmitter;

var errors = require('./errors'),
    Config = require('./config'),
    blacklist = require('./blacklist');

module.exports = {
  //所有继承都统一继承EventEmitter
  Observable: inherit(EventEmitter),

  // 通过指定目录中,把非index.js的其他文件都加载封装成一个modules返回。
  // 成样更加方便加载程序包
  index: function (dirname, indexpath) {
    var extensions = {js: 1},
        modules = {};

    indexpath = indexpath || path.join(dirname, 'index.js');

    // Load all exported objects into a single module.
    fs.readdirSync(dirname).forEach(function (filename) {
      var fullpath = path.join(dirname, filename),
          parts    = filename.split('.'),
          module, name;

      if (fullpath !== indexpath && extensions[parts.pop()] && '.' !== filename[0]) {
        name = parts.join('.');
        module = require(fullpath);

        // Grab the function name or module name if possible.
        if (typeof module.name === 'string') {
          name = module.name;
        }

        modules[name] = module;
      }
    });

    return modules;
  },

  //把指定方法绑定到对象，即mixin对象并且给方法加入该对象的作用域
  bindAll: function (object /* args */) {
    var methods = [].slice.call(arguments, 1);
    if (arguments.length === 2 && Array.isArray(arguments[1])) {
      methods = arguments[1];
    }

    methods.forEach(function (method) {
      if (typeof object[method] === 'function') {
        object[method] = object[method].bind(object);
      }
    });

    return object;
  },

  // 扩展的方法，mixin
  extend: extend,

  // 继承
  inherit: inherit,

 //提取给定对象的指定的属性或方法
  extract: function (obj /* keys */) {
    var keys = [].slice.call(arguments, 1),
        collected = {};

    keys.forEach(function (key) {
      if (obj[key]) {
        collected[key] = obj[key];
      }
    });

    return collected;
  },
  //判断是否时ajax请求
  isAjax: function (req) {
    return (req.get('X-Requested-With') || '').toLowerCase() === 'xmlhttprequest';
  },
  // 随即生成6位的短编码
  shortcode: function () {
    var vowels = 'aeiou',
        consonants = 'bcdfghjklmnpqrstvwxyz',
        word = '', length = 6, index = 0, set;

    for (; index < length; index += 1) {
      set = (index % 2 === 0) ? vowels : consonants;
      word += set[Math.floor(Math.random() * set.length)];
    }

    return word;
  },
  // gravatar.com是提供一个头像服务的网站，通过email可以取回再gravatar中注册的头像，size是返回的头像大小
  gravatar: function (email, size) {
    email = (email || '').trim().toLowerCase();
    var hash = crypto.createHash('md5').update(email).digest('hex');
    return 'http://www.gravatar.com/avatar/' + hash + '?s=' + (size || 26);
  },
  
  //计算过期时间
  since: function (date) {
    var diff    = (+new Date() - date) / 1000,
        message = 'a long time',
        timespan;

    try {
      // make "Thu Jan 10 2013 16:32:37 GMT+0000 (GMT)" into "10 Jan 2013"
      var parts = date.toString().split(' ').slice(1,4);
      message = parts.slice(2).concat(parts.slice(0,2)).reverse().join(' ');
    } catch(e) {}

    if (diff < 60) {
      timespan = Math.floor(diff);
      message  = '{timespan} second';
    }
    else if (diff < 3600) {
      timespan =  Math.floor(diff / 60);
      message  = '{timespan} minute';
    }
    else if (diff < 86400) {
      timespan = Math.floor(diff / 3600);
      message  = '{timespan} hour';
    }
    else if (diff < 604800) {
      timespan = Math.floor(diff / 86400);
      message  = '{timespan} day';
    }
    else if (diff < 2419200) {
      timespan = Math.ceil(diff / 604800);
      message  = '{timespan} week';
    }
    else if (diff < 29030400) {
      timespan = Math.floor(diff / 2419200);
      message  = '{timespan} month';
    }

    if (timespan) {
      if (timespan !== 1) {
        message += 's';
      }
      return message.replace('{timespan}', timespan) + ' ago';
    } else {
      return message;
    }
  },
  //渲染时，过滤换行符
  cleanForRender: function (str) {
    var cache = {
      '\u2028': '&#x2028;',
      '\u2029': '&#x2029;'
    };

    var re, bad;

    for (bad in cache) {
      if (str.indexOf(bad) != -1) {
        re = new RegExp(bad, 'g');
        str = str.replace(re, cache[bad]);
      }
    }

    return str;
  },
  //存储数据库，过滤保留字
  validate: function(bin, fn, reserved){
    if (!blacklist.validate(bin)) {
      fn(new errors.BadRequest('Unable to save: Post contains blacklisted content'));
    } else if (bin.url && reserved.length && reserved.indexOf(bin.url) > -1) {
      fn(new errors.BadRequest('Unable to save: This is a reserved url'));
    } else {
      fn();
    }
  },
  require: function(libPath){
    var object = require(libPath);
    if(!object){
      object = require(path.join(process.cwd(), 'lib/' + libPath.slice(libPath.indexOf('/') + 1)));
    }
    return object;
  },
  getOptions: function(dirname){
    var localconfig = process.env.JSBIN_CONFIG || path.resolve(dirname, '..', 'config.local.json');
    return new Config(localconfig);
  }
};
