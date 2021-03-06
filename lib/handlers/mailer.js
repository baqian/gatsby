var Observable = require('../utils').Observable,
    errors = require('../errors');
// todo: 所有的邮件模版统一管理，不走app.render了
module.exports = Observable.extend({
  constructor: function MailHandler(transport, render) {
    this.transport = transport;
    this.render = render;
  },
  isEnabled: function () {
    return !!this.transport;
  },
  forgotPassword: function (to, context, fn) {
    var _this = this;

    this.render('reset_email.txt', context, function (err, body) {
      if (err) {
        return fn(err);
      }

      _this.sendMail({
        from: "Dave <dave-the-robot@jsbin.com>",
        to: to,
        subject: 'JS Bin Password Reset',
        text: body
      }, fn);
    });
  },
  errorReport: function (to, context, fn) {
    var _this = this;

    this.render('error_email.txt', context, function (err, body) {
      if (err) {
        return fn(err);
      }

      _this.sendMail({
        from: "Dave <dave-the-robot@jsbin.com>",
        to: to,
        subject: 'JS Bin Crash Report: ' + context.message + ' #' + context.hash,
        text: body
      }, fn);
    });
  },
  reportBin: function (to, context, fn) {
    var _this = this;

    this.render('report_email.txt', context, function (err, body) {
      if (err && fn) {
        return fn(err);
      }

      _this.sendMail({
        from: context.from || "Dave <dave-the-robot@jsbin.com>",
        to: to,
        subject: 'JS Bin Abuse Report',
        text: body
      }, fn);
    });
  },
  sendMail: function (options, fn) {
    var error = new errors.MailerError('Mail Transport is not configured');

    // protects from mistakes
    if (!fn) {
      fn = function () {};
    }

    if (!this.transport) {
      return fn(error);
    }

    this.transport.sendMail(options, function (err) {
      fn(err ? error : null);
    });
  }
});
