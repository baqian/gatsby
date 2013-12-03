var utils = require('./utils'),
    hogan      = utils.require('./hogan'),
    middleware = utils.require('./middleware'),
    metrics    = utils.require('./metrics'),
    mailHandler = utils.require('./handlers/mailer'),
    options    = utils.getOptions(__dirname),
    
    nodemailer = require('nodemailer'),
    express    = require('express'),
    flatten    = require('flatten.js').flatten,
    path       = require('path'),
    app        = express(),
    store      = require('./store')(options.store),
    routes     = require('./routes'),
    
    url        = require('url'),
    flattened;

//数据库连接池
app.store  = store;
//邮箱服务
app.mailer = (function (mail) {
  var mailTransport = null,
      method   = mail && mail.adapter,
      settings = mail && mail[method];

  if (method && options) {
    mailTransport = nodemailer.createTransport(method, settings);
  }

  return new mailHandler(mailTransport, app.render.bind(app));
})(options.mail);

//定义发布和开发的类型
app.PRODUCTION  = 'production';
app.DEVELOPMENT = 'development';

// 优先取process中的全局变量，获取环境的状态，因为如果走bin调用的话，则在命令行中可以设置发布还是开发版本
if (process.env.NODE_ENV) {
  options.env = process.env.NODE_ENV;
}
process.env.NODE_ENV = options.env;

// 设置时区，也可以通过命令行取定义
if (!process.env.TZ && options.timezone) {
  process.env.TZ = options.timezone;
}

(function () {
  // 同样端口号也可以命令行设置
  var port = process.env.PORT;

  // 查看onfig.default中是否设置了端口号
  if (process.env.JSBIN_PORT) {
    if (options.url.host.indexOf(':') === -1) {
      options.url.host += ':' + process.env.JSBIN_PORT; //加上端口号
    } else {
      options.url.host = options.url.host.replace(/\:\d+$/, function () {
        return ':' + process.env.JSBIN_PORT; //替换端口号
      });
    }
  }

  if (!port) {
    options.url.host.replace(/\:(\d+)$/, function (m, p) {
      if (p.length) {
        port = p;
      }
    });
  }

  if (!port) {
    port = 80;
  }

  // 保存起来
  options.port = port;
})();

// 获取前缀
options.url.prefix = options.url.prefix.replace(/\/$/, '');

// 把配置扁平化
// ｛a: {b: 1, e: 2}, c: 2, d: [3, 4]} =>
// {'a b': 1, 'a e': 2, c: 2, d: [3, 4]} 
flattened = flatten(options, ' ');//如果把不指定，则已点来分隔key

Object.getOwnPropertyNames(flattened).forEach(function (key) {
  app.set(key, flattened[key]); //保存为app的变量池
});

// 激活反向代理，这样就可以获取到用户的ip了
// 通过req.headers['x-real-ip'] || req.headers['x-forwarded-for']来获得
if (process.env.NODE_ENV === app.PRODUCTION) {
  app.enable('trust proxy');
}

app.set('root', path.resolve(path.join(__dirname, '..')));
app.set('version', require('../package').version);
app.set('view engine', 'html'); //走html渲染，所以app.render时已html格式来过滤文本
app.set('views', path.join(app.set('root'), 'views')); //views目录下
app.set('url prefix', options.url.prefix); //url前缀
app.set('url full', (app.set('url ssl') ? 'https://' : 'http://') + app.set('url host') + app.set('url prefix'));//分有无ssl验证2中情况
app.set('basepath', app.set('url prefix')); //用于redirect跳转

if (options.url.static) { //用于在页面中引入静态js|css
  app.set('static url', (app.set('url ssl') ? 'https://' : 'http://') + app.set('url static'));
} else {
  app.set('static url', app.set('url full'));
}

app.engine('html', hogan.renderer).engine('txt', hogan.renderer);

// 存一些本地配置
app.locals({
  version: app.set('version')
});

app.connect = function (callback) {
  app.emit('before', app); //before事件

  // 通过配置，判断app.get('env')来其中内容
  app.configure(function () {
    var mount = app.set('url prefix') || '/',
        logger;

    logger = process.env.JSBIN_LOGGER || app.set('server logger') || 'tiny';

    if (logger !== 'none') {
      app.use(express.logger(logger));
    }
    
    app.use(mount, express.static(path.join(process.cwd(), 'src')));
    //安装多个中间件
    //中间件就是在请求过程中，符合条件时立即执行，然后在才到路由指定的函数
    app.use(mount, express.static(path.join(app.set('root'), 'public')));//静态文件设置为对中间件不可见，即不对其做任何处理和改动
    app.use(middleware.limitContentLength({limit: app.set('max-request-size')}));
    app.use(express.cookieParser(app.set('session secret')));
    app.use(express.cookieSession({key: 'jsbin', cookie: {maxAge: 365 * 24 * 60 * 60 * 1000}}));
    app.use(express.urlencoded());
    app.use(express.json());
    app.use(middleware.csrf({ ignore: ['/'] }));
    app.use(middleware.subdomain(app));
    app.use(middleware.noslashes());
    app.use(middleware.ajax());
    app.use(middleware.cors());
    app.use(middleware.jsonp());
    app.use(middleware.flash());
    app.use(mount, app.router);

    // 注册所有的路由
    routes(app);
  });
  
  app.emit('after', app);//after事件

  //数据库连接池初始化功能，
  //真正启动服务器时app.listen
  store.connect(function (err) {
    if (err) {
      metrics.increment('error.store.connect');
      throw err;
    }

    var port = app.set('port');
    module.exports.listen(port);//这里调的其实是app.listen

    if (typeof callback === 'function') {
      callback();
    }
    app.emit('connected');

    process.stdout.write('JS Bin v' + app.set('version') + ' is up and running on port ' + app.set('port') + '. Now point your browser at ' + app.set('url full') + '\n');
  });
};

// 返回app
module.exports = app;

// 判断是在根目录下运行的
if (require.main === module) {
  app.connect();
}
