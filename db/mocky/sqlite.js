var sqlite3 = require('sqlite3').verbose(),
    templates = require('./sql_templates'),
    inherit = require('soak').inherit,
    fs = require('fs');
    
function shortcode() {
  var vowels = 'aeiou',
      consonants = 'bcdfghjklmnpqrstvwxyz',
      word = '', length = 6, index = 0, set;

  for (; index < length; index += 1) {
    set = (index % 2 === 0) ? vowels : consonants;
    word += set[Math.floor(Math.random() * set.length)];
  }

  return word;
}

module.exports = inherit(Object, {
  defaults: null,
  constructor: function SQLite(options) {
    this.defaults = {mockdata: '', realdata: '', templates: ''};
    this.database = process.cwd() + options.location;
    this.command = process.cwd() + options.command;
  },
  connect: function (fn) {
    var self = this;
    this.connection = new sqlite3.Database(this.database, function () {
      fs.readFile(self.command, 'utf8', function (err, sql) {
        if (err) {
          return fn(err);
        }
        self.connection.serialize(function () {
          sql = sql.trim();
          if (sql) {
            self.connection.exec(sql, fn);
          } else {
            fn();
          }
        });
      });
    });
  },
  disconnect: function (fn) {
    this.connection.close();
    fn();
  }
});
