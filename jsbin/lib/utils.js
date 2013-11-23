var extend = require('soak').mixin,
    path = require('path'),
    metrics    = require('./metrics'),
    errors = require('./errors'),
    utils = require(path.join(process.cwd(), 'lib/utils'));
module.exports = extend(utils, {
  re: {
    flatten: /\s+/g,
    body: /<body.*?>\s*(.*)/m,
    meta: /<meta name="description" content="(.*?)"/,
    tags: /<[^>]+>/g,
    title: /<title>(.*)<\/title>/
  },
  //返回bin的标题，优先去meta中的description信息，建议都写在其中
  titleForBin: function (bin) {
    var html = (bin.html || '').replace(this.re.flatten, ' '), // flatten
        javascript = (bin.javascript || '').replace(this.re.flatten, ' ').trim(),
        css = (bin.css || '').replace(this.re.flatten, ' ').trim(),
        matches = (html.match(this.re.meta) || []);

    // try to return the meta[description] first
    if (matches.length === 2 && matches[1].trim()) {
      return matches[1];
    }

    // then some of the body content with tags stripped
    matches = (html.match(this.re.body) || ['', ''])[1].replace(this.re.tags, '').trim();

    if (matches) {
      return matches;
    }

    // No title return JavaScript.
    if (javascript) {
      return javascript;
    }

    if (css) {
      return css;
    }

    matches = (html.match(this.re.title) || []);
    if (matches.length === 2 && matches[1].trim()) {
      return matches[1];
    }

    return html.replace(this.re.tags, '').trim();
  },
  //和jsbin相关的
  queryStringForBin: function (bin, defaults) {
    var params = [];
    ['html', 'javascript', 'css'].forEach(function (key) {
      if (bin[key]) {
        params.push(key);
      }
    });
    params.push('live');
    return params.join(',');
  },
  // Example:
  //
  //   object = {onData: function () {}, onEnd: function () {});
  //   utils.bindMetrics('object', object, 'onData', 'onEnd');
  // 和bindAll类似，唯一不同的时还计数
  bindMetrics: function (namespace, object /* args */) {
    var methods = [].slice.call(arguments, 2);
    if (arguments.length === 3 && Array.isArray(arguments[2])) {
      methods = arguments[2];
    }

    methods.forEach(function (method) {
      if (typeof object[method] === 'function' && method !== 'constructor') {
        var original = object[method];
        object[method] = function () {
          metrics.increment(namespace + '.method.' + method);
          original.apply(object, [].slice.call(arguments));
        };
      }
    });

    return object;
  }
});

