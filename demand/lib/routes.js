var path = require('path'),
    utils = require('./utils'),
    helpers  = utils.require('./helpers'),
    errors   = utils.require('./errors'),
    spike    = utils.require('./spike');
    
var express  = require('express'),
    handlers = require('./handlers'),
    models   = require('./models');

function tag(label) {
  return function (req, res, next) {
    req[label] = true;
    next();
  };
}

module.exports = function (app) {
  // 封装功能到沙箱环境，即把核心的功能封装起来，方便调用
  var sandbox = {
    store:   app.store, //数据库连接池
    models:  models.createModels(app.store), //数据模型实体类
    mailer:  app.mailer, //邮箱服务器
    helpers: helpers.createHelpers(app) //辅助类
  }, binHandler, sessionHandler, errorHandler;

  // 其实是各种控制器
  binHandler = new handlers.BinHandler(sandbox);
  //sessionHandler = new handlers.SessionHandler(sandbox);
  //errorHandler = new handlers.ErrorHandler(sandbox);

  // 产品示例,暂时沿用
  app.get(['/video', '/videos', '/tutorials'], function (req, res) {
    res.redirect('http://www.youtube.com/playlist?list=PLXmT1r4krsTooRDWOrIu23P3SEZ3luIUq');
  });

  // 各事件的绑定实现，暂不需要
  //binHandler.on('updated', spike.ping.bind(spike));
  //binHandler.on('reload', spike.reload.bind(spike));
  //binHandler.on('latest-for-user', spike.updateUserSpikes.bind(spike));
  //binHandler.on('render-scripts', spike.appendScripts.bind(spike));

  // 对于路由中（url）出现的bin和name参数进行统一处理，
  // 如果发现bin参数就取bin对象，如果有name则取回用户
  //app.param('bin', binHandler.loadBin);
  //app.param('name', sessionHandler.loadUser);

  // N多路由设置
  /*
  app.get('/', binHandler.getDefault);
  app.get('/gist/*', binHandler.getDefault);
  app.post('/', binHandler.getFromPost);

  // Login/Create account.
  app.post('/sethome', sessionHandler.routeSetHome);
  app.post('/logout', sessionHandler.logoutUser);
  app.post('/forgot', sessionHandler.forgotPassword);
  app.get('/forgot', sessionHandler.requestToken);
  app.get('/reset', sessionHandler.resetPassword);

  // List
  app.get('/list/:user', binHandler.getUserBins);
  app.get('/list',       binHandler.getUserBins);
  app.get('/show/:user', binHandler.getUserBins);
  app.get('/user/:user', binHandler.getUserBins);

  // Latest
  app.get('/:bin/latest((.|\/):format)?', binHandler.redirectToLatest);
  app.get('/:bin/latest/edit', binHandler.redirectToLatest);

  // Quick and easy urls for test - allows me to do /rem/last on my mobile devices
  app.get('/:name/last?/:quiet(quiet)?', tag('keepLatest'), binHandler.getLatestForUser, spike.getStream, binHandler.getBinPreview);
  app.get('/:name/last/edit', binHandler.getLatestForUser, binHandler.getBin);
  app.get('/:name/last/watch', binHandler.getLatestForUser, binHandler.live, binHandler.getBin);

  // Edit
  app.get('/:bin/:rev?/edit', binHandler.getBin);
  app.get('/:bin/:rev?/watch', tag('live'), binHandler.getBin);
  app.get('/:bin/:rev?/embed', tag('embed'), binHandler.getBin);

  app.post('/:bin/:rev?/report', binHandler.report);

  // Save
  app.post('/save', binHandler.createBin);


  // Use this handler to check for a user creating/claiming their own bin url.
  // We use :url here to prevent loadBin() being called and returning a not
  // found error.
  app.post('/:url/save', binHandler.claimBin);

  // If the above route fails then it's either a clone or a revision. Which
  // the handler can check in the post body.
  app.post('/:bin/:rev?/save', binHandler.createRevisionOrClone);
  app.post('/:bin/:rev?/reload', binHandler.reload);

  // Archive
  app.post('/:bin/:rev/archive', binHandler.archiveBin.bind(null, true));
  // Unarchive
  app.post('/:bin/:rev/unarchive', binHandler.archiveBin.bind(null, false));

  // Download
  app.get('/:bin/:rev?/download', binHandler.downloadBin);

  // Source
  app.get('/:bin/:rev?/source', binHandler.getBinSource);
  app.get('/:bin/:rev?.:format(js|json|css|html|md|markdown|stylus|less|coffee|jade)', binHandler.getBinSourceFile);
  app.get('/:bin/:rev?/:format(js)', function (req, res) {
    // Redirect legacy /js suffix to the new .js extension.
    res.redirect(301, req.path.replace(/\/js$/, '.js'));
  });

  // Log
  app.get('/:bin/:rev/log', spike.getLog);
  app.post('/:bin/:rev/log', spike.postLog);

  // Preview
  app.get('/:bin/:quiet(quiet)?', spike.getStream, binHandler.getBinPreview);
  app.get('/:bin/:rev?/:quiet(quiet)?', spike.getStream, binHandler.getBinPreview);

  // Catch all
  app.use(errorHandler.notFound);

  // Error handler.
  app.use(errorHandler.httpError);
  */
  app.get('/', binHandler.getDefault)
  // 开发环境下，输出错误的信息
  app.configure('development', function () {
    app.use(express.errorHandler({showStack: true, dumpExceptions: true}));
  });

  // 发布后有记录不输出
  app.configure('production', function () {
    app.use(errorHandler.uncaughtError);
  });
};
