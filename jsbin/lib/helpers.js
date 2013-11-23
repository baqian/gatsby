var path = require('path'),
    helpers = require(path.join(process.cwd(), 'lib/helpers')),
    extend = require('soak').mixin;
// A collection of useful methods that are essentially utils but are
// specific to the application and require access to the app object.
module.exports.createHelpers = function createHelpers(app) {
  return extend(helpers.createHelpers(app), {
    // matches the format used in the client side code (jsbin.js)
    jsbinURL: function (bin) {
      var url = app.set('url full');

      if (bin.url) {
        url += '/' + bin.url;

        if (bin.revision && bin.revision !== 1) {
          url += '/' + bin.revision;
        }
      }
      return url;
    },

    // Same as helper.url() but creates a url for the bin object provided.
    urlForBin: function (bin, full) {
      var url = [];

      if (bin.url) {
        url.push(bin.url);

        if (bin.revision) {
          url.push(bin.revision);
        }
      }

      return this.url(url.join('/'), full);
    },

    // Same as helper.urlForBin() but returns an url for the edit page.
    editUrlForBin: function (bin, full) {
      return this.urlForBin(bin, full) + '/edit';
    },
    // Returns a url for a static resource.
    urlForStatic: function (path) {
      if (path && path[0] === '/') {
        path = path.slice(1);
      }

      var root = app.set('static url');
      return path ? root + '/' + (path || '') : root;
    }
  });
};