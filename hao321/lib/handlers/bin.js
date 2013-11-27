var async      = require('asyncjs'),
    path       = require('path'),
    crypto     = require('crypto'),
    utils      = require('../utils'),
    errors     = utils.require('./errors'),
    //scripts    = require('../../scripts.json'),
    Observable = utils.Observable;
    
module.exports = Observable.extend({
  constructor: function BinHandler(sandbox) {
    Observable.apply(this, arguments);

    this.models = sandbox.models;
    this.helpers = sandbox.helpers;
    this.mailer = sandbox.mailer;

    // For now we bind all methods to the class scope. In reality only those
    // used as route callbacks need to be bound.
    var methods = Object.getOwnPropertyNames(BinHandler.prototype).filter(function (prop) {
      return typeof this[prop] === 'function';
    }, this);

    utils.bindAll(this, methods);
  },
  getDefault: function(req, res, next){
    var globalDpl = this.helpers.globalDpl();
    res.render('index', {
        globaljs: globalDpl.globaljs,
        globalcss: globalDpl.globalcss,
        header: globalDpl.header.render({nav: true}),
        footer: globalDpl.footer.render(null)
    });
  }
});