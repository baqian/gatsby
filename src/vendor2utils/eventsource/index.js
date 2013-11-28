KISSY.add(function(S, JSON, Event){
  var EventSource ＝ window.EventSource,
      useSS = false;
      
  //如果有sessionStorage,则使用
  try {
    sessionStorage.getItem('foo');
    useSS = true;
  } catch (e) {}
  
  //规范，所有后缀为preview， edit，或者watch，都要实时更新
  var preview_suffix = /\/preview.*$/,
      edit_suffix = /\/edit.*$/,
      watch_suffix = /\/watch.*$/;
  
  function addStyleSheet(event){
    var id = event.id || 'J_inlineStyle',
        style = event.style;
    var style = document.getElementById(id);//jsbin-css
    if(!style) return;
    
    if (style.styleSheet) {
      style.styleSheet.cssText = style;
    } else {
      style.innerHTML = style;
    }
  }
  
  function Spike(){
    Spike.superclass.constructor.apply(this, arguments);
    this.initialize();
  }
  
  Spike.ATTRS = {
    blocks: {
      setter: function(b){
        if(S.isString(b)){
          return [b];
        }
      }
    },
    editors: {
      value: null
    }
  }
  
  S.extend(Spike, Base, {
    queue: [],
    eventSource: null,
    initialize: function(){
      var self = this,
          pathname = location.pathname;
      
      var sourceId = pathname.replace(preview_suffix, '').replace(edit_suffix, '').replace(watch_suffix, ''),
          codecasting =  pathname.test(watch_suffix);//启动实时更新，而其他的只有在刷新页面的时候才更新
      if (!codecasting) {
        //非watch还报错提示
        Event.on(window, 'error', function (e) {
          self.error({ message: e.message }, e.filename + ':' + e.lineno);
        });

        self.restore();
      }
      
      S.later(function () {
        self.eventSource = new EventSource(sourceId + '?' + Math.random());
        if (codecasting) {
          self._codecastStream();
        } else {
          self._renderStream();
        }
      }, 500);
    },
    //events = {css: addStyle, reload: reload, javascript: reload, html: reload}
    _renderStream: function(){
      var self = this,
          blocks = self.get('blocks'),
          es = self.eventSource;
      for(var i = blocks.length; i--;){
        if(blocks[i] === 'css'){
          es.addEventListener(blocks[i], addStyleSheet]);
          continue;
        }
        es.addEventListener(blocks[i], self.reload);
      }
    },
    //events = {css: setCode, javascript: setCode, html: setCode},
    //editors =jsbin.panels.panels
    _codecastStream: function(events){
      var self = this,
          blocks = self.get('blocks'),
          es = self.eventSource;
      for(var i = blocks.length; i--;){
        es.addEventListener(type, self.setCode);
      }
    }
  });
  
  S.augment(Spike, {
    error: function(error, cmd){
      var msg = JSON.stringify({ response: error.message, cmd: cmd, type: 'error' });
      if (remoteWindow) {
        remoteWindow.postMessage(msg, origin);
      } else {
        this.queue.push(msg);
      }
    },
    restore: function(){
      var data = {},
      rawData = useSS ? sessionStorage.spike : window.name,
      scroll;

      if ((!useSS && window.name == 1) || !rawData) return;

      try {
        data = JSON.parse(rawData);
        // eval('data = ' + rawData);
        Event.on(window, 'load', function(e){
          window.scrollTo(data.x, data.y);
        });
      } catch (e) {}
    },
    reload: function(){
      var data = JSON.stringify({ y: window.scrollY, x: window.scrollX });
      try {
        if (useSS) {
          sessionStorage.spike = data;
        } else {
          window.name = data;
        }
        window.location.reload();
      } catch (e) {}
    },
    /**
     * 
     * @param {[type]} event [description]
     */
    setCode: function(event){
      var self = this,
          editors = self.get('editors');
        editors[event.type].setCode(event.data);
    }
  });
  
  return Spike;
},{
  requires: [
  'json',
  'event',
  'vendor/eventsource'
  ]
});

