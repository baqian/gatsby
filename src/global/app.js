




window.CodeMirror = CodeMirror; 
delete CodeMirror.keyMap['default']['Cmd-L'];



;(function(S, Gatsby){
  
  //建立新的命名空间----------------------------------------------------
  window.Gatsby = Gatsby = {
    $attrs: {
      
    },
    get: function(key){
      return this.$attrs[key];
    },
    set: function(key, value){
      this.$attrs[key] = value;
    },
    Loader: S.Loader
  }
  
  
  
  
  S.augment(Gatsby, {
    UA: S.UA,
    JSON: S.JSON,
    Sandbox: new Sandbox()
  })
  
  
  var location = window.location,
      search = location.search,
      hash = location.hash,
      pathname = location.pathname;
  var win = window,
      doc = window.document,
      body = doc.body;
    
  function Queue(processor) {
    this.queue = [];
    this.isReady = false;
    this.processor = processor;
  }

  Queue.prototype = {
    ready: function () {
      if (!this.isReady) {
        this.isReady = true;
        this.queue.forEach(this.processor);
      }
    },
    push: function (data) {
      if (this.isReady) {
        this.processor(data);
      } else {
        this.queue.push(data);
      }
    }
  };

function Sandbox(url, Loader, JSON) {
  function send(data) {
    source.postMessage(data, frameHost);
  }

  var iframe = doc.createElement('iframe');
      frameHost = location.origin,
      iframe.src = jsbin.root + '/sandbox.html?' + url,
      source = null,
      guid = +new Date,
      callbacks = {},
      queue = new Queue(send);

  iframe.style.display = 'none';
  body.appendChild(iframe);

  Loader.on('message', function (event) {
    var result;

    if (event.origin === frameHost) {
      if (event.data === '__pong__') {
        source = event.source;
        queue.ready();
      } else {
        result = JSON.parse(event.data);
        if (callbacks[result.guid]) {
          callbacks[result.guid](result.data);
        }
      }
    }
  }, false);
  
  iframe.onload = function () {
    iframe.contentWindow.postMessage('__ping__', frameHost);
  };

  return {
    get: function (what, callback) {
      guid++;
      callbacks[guid] = callback;
      queue.push(JSON.stringify({ guid: guid, what: what }));
    }
  }
}
  
  S.augment(Gatsby, {
    getUrl: function(){
      //todo
    },
    UA: S.UA,
    //过滤hash值
    hashJumpEdit: function(){
      var editReg = /#\/.*?\/(\d+\/)?edit/i;
      if(hash && editReg.test(hash)){
        var root = this.get('root');
        window.location = root + hash.substring(1) + search;
      }
    },
    //限制滚动
    mobileScrollTop: function(){
      if(!this.UA.mobile){
        body.onscroll = win.onscroll = function () {
          if (body.scrollTop !== 0) {
            win.scrollTo(0,0);
          }
          body.onscroll = null;
          return false;
        };
      }
    },
    //下载内容
    bindDownload: function(){
      var self = this;
      S.one('#download').on('click', function(e){
        e.preventDefault();
        window.loation = self.getURL() + '/download';
      });
    }
  });
  
  return Gatsby;
})(KISSY, 'Gatsby');

