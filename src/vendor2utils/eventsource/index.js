KISSY.add(function(S, JSON, Event, Storage){
  var EventSource ＝ window.EventSource;
  
  //规范，所有后缀为preview， edit，或者watch，都要实时更新
  var preview_suffix = /\/preview.*$/,
      edit_suffix = /\/edit.*$/,
      watch_suffix = /\/watch.*$/;
  function getSourceId(pathname){
    pathname = pathname || window.location.pathname;
    return pathname.replace(preview_suffix, '').replace(edit_suffix, '').replace(watch_suffix, '');
  }
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
  }
  
  Spike.ATTRS = {
    blocks: {
      setter: function(b){
        if(S.isString(b)){
          return [b];
        }
      }
    },
    watchCB: {
      
    }
  }
  
  S.extend(Spike, Base, {
    /**
     * sourceId是实例的唯一标示，比如jsbin是一串key+id
     * codecasting是watch状态，要求url后缀是/watch
     * @return {[type]} [description]
     */
    init: function(){
      var self = this,
          pathname = location.pathname,
          sourceId = getSourceId(pathname),
          codecasting = pathname.test(watch_suffix);
      if (!codecasting) { //非watch
        Event.on(window, 'error', function (e) {
          self.error({ message: e.message }, e.filename + ':' + e.lineno);
        });
        //恢复之前的滚动位置
        self.restore();
      }
      S.later(function () {
        var eventSource = new EventSource(sourceId + '?' + Math.random());
        if (codecasting) {
          self._codecastStream(eventSource);
        } else {
          self._renderStream(eventSource);
        }
      }, 500);
    },
    //events = {css: addStyle, reload: reload, javascript: reload, html: reload}
    _renderStream: function(es){
      var self = this,
          blocks = self.get('blocks');
      //监听事件流，这里的事件处理就是保存到sessionStorage中，然后刷新页面看最新效果。
      //当然如果是样式的话就没必要刷新了，当前页面也可以更新
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
    //watch状态下是实时更新编辑器中的代码。
    _codecastStream: function(es){
      var self = this,
          blocks = self.get('blocks'),
          watchCB = self.get('watchCB') || function(){};
      for(var i = blocks.length; i--;){
        es.addEventListener(type, watchCB);
      }
    }
  });
  
  S.augment(Spike, {
    queue: [],
    remoteWindow: null,
    origin: null,
    /**
     * 把错误信息通过
     * @param  {[type]} error [description]
     * @param  {[type]} cmd   [description]
     * @return {[type]}       [description]
     */
    error: function(error, cmd){
      var self = this,
          remoteWindow = self.remoteWindow,
          origin = self.origin;
      var msg = JSON.stringify({ response: error.message, cmd: cmd, type: 'error' });
      if (remoteWindow && origin) {
        remoteWindow.postMessage(msg, origin);
      } else {
        self.queue.push(msg);
      }
    },
    restore: function(){
      var data = Storage.getItem('spike'),
          scroll;

      if (!data) return;

      try {
        Event.on(window, 'load', function(e){
          window.scrollTo(data.x, data.y);
        });
      } catch (e) {}
    },
    reload: function(){
      var data = JSON.stringify({ y: window.scrollY, x: window.scrollX });
      try {
        Storage.setItem('spike', data);
        window.location.reload();
      } catch (e) {}
    }
  });
  
  return Spike;
},{
  requires: [
  'json',
  'event',
  'vendor2utils/storage/',
  'vendor/eventsource'
  ]
});

