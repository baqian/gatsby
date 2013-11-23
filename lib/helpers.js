
module.exports.createHelpers = function createHelpers(app){
  return {
    // 使用express的app.set
    set: app.set.bind(app),

    // 使用express的app.render
    render: app.render.bind(app),

    // 是否时发布产品，其中毁把js打包的.
    production: app.set('env') === app.PRODUCTION,

    // 加入google的统计的代码片段.
    analytics: function (fn) {
      app.render('analytics', {id: app.set('analytics id')}, fn);
    },

    // Generates a url for the path provided including prefix. If the second
    // full parameter is provided then a full url including domain and
    // protocol will be returned.
    url: function (path, full) {
      var root = '';

      if (full) {
        root = app.set('url full');
      } else {
        root = app.set('url prefix');
      }

      // Remove preceding slash if one exists.
      if (path && path[0] === '/') {
        path = path.slice(1);
      }

      return path ? root  + '/' + path : root;
    },
    urlForStatic: function (path) {
      if (path && path[0] === '/') {
        path = path.slice(1);
      }

      var root = app.set('static url');
      return path ? root + '/' + (path || '') : root;
    }
  }
}
  



