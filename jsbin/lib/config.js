var path = require('path'),
    Config = require(path.join(process.cwd(), 'lib/config')),
    localconfig = process.env.JSBIN_CONFIG || path.resolve(__dirname, '..', 'config.local.json');

module.exports = new Config(localconfig);
