var utils = require('./utils'),
    metrics = utils.require('./metrics');
    
var path = require('path');

function Store(options) {
  var Adapter = require(path.join(process.cwd(), options.path));
  this.adapter = new Adapter(options[options.adapter]);
  check(this.adapter, methods);
}

var check = function (adapter, methods) {
  methods.forEach(function (method) {
    if (!adapter[method]) throw new Error("DB adapter missing method: " + method);
  });
};

// Methods that should be supported by adaptors.
var methods = [
  'connect',
  'disconnect'
];

// Proxy the methods through the store.
methods.forEach(function (method) {
  Store.prototype[method] = function () {
    metrics.increment('db.method');
    metrics.increment('db.method.' + method);
    this.adapter[method].apply(this.adapter, arguments);
  };
});

module.exports = function createStore(options) {
  return new Store(options);
};
module.exports.Store = Store;
