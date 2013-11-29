KISSY.add(function(S, Base, JSON){
  var data = win.top.name ? JSON.parse(win.top.name) : {};
  function Storage(){
    Storage.superclass.constructor.apply(this, arguments);
  }
  
  S.extend(Storage, Base, {
    
  });
  
  if(window.sessionStorage){
    S.augment(Storage, window.sessionStorage);
  }else if(window.localStorage){
    S.augment(Storage, window.localStorage);
  }else{
    var win = window;
    S.augment(Storage, {
      clear: function () {
        data = {};
        win.top.name = '';
      },
      getItem: function (key) {
        return data[key] || null;
      },
      removeItem: function (key) {
        delete data[key];
        win.top.name = JSON.stringify(data);
      },
      setItem: function (key, value) {
        data[key] = value;
        win.top.name = JSON.stringify(data);
      }
    });
  }
  
  return new Storage();
}, {
  rquires:[
    'base',
    'json'
  ]
});

