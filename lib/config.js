var fs = require('fs'),
    path = require('path'),
    existsSync = fs.existsSync || path.existsSync,
    inherit = require('soak').inherit,
    config = require('../config.default.json'),
    EventEmitter = require('events').EventEmitter;

function deepExtend(target, object) {
  Object.getOwnPropertyNames(object).forEach(function (key) {
    var value = object[key];

    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      target[key] = deepExtend(target[key] || {}, value);
    } else {
      target[key] = value;
    }
  });
  return target;
}

module.exports = inherit(EventEmitter, {
  constructor: function Config(localconfig){
    if(localconfig && existsSync(localconfig)){
      return deepExtend(config, require(localconfig));
    }else{
      return config;
    }
    
  }
})
