var models = require('../utils').index(__dirname, __filename);

// 把获取的models全部初始化，返回models的实例
module.exports.createModels = function (store) {
  var initialized = {}, Model, name;
  for (name in models) {
    if (models.hasOwnProperty(name)) {
      Model = models[name];

      // Convert ForgotTokenModel -> forgotToken
      name = name.slice(0, -5);
      name = name[0].toLowerCase() + name.slice(1);

      initialized[name] = new Model(store);
    }
  }
  return initialized;
};
