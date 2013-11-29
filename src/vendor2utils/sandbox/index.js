document.domain = document.domain;

;(function (win) {
  function Queue(processor) {
    this.queue = [];
    this.isReady = false;
    this.processor = processor;
  }

  Queue.prototype = {
    queue: null,
    isReady: null,
    processor: null,
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



  function addEvent(type, fn) {
    window.addEventListener ? window.addEventListener(type, fn, false) : window.attachEvent('on' + type, fn);
  };
  var domReady = false, queue;
  function Sandbox(agent, root, url){
    var me = this;
    
    function ready(type, fn){
      if(!domReady){
        fn.call(win);
        domReady = true;
        script[type] = null;
      }
    }
    me.ready = KISSY.ready || function(fn){
      //简单实现，不建立事件队列了。
      if(domReady){
        fn.call(win);
      }else{
        var script = document.createElement('script');
        script.src = location.search.substring(1);
        document.body.appendChild(script);
        script.onreadystatechange = function(){
          ready('onreadystatechange', fn);
        };
        script.onload = function(){
          ready('onload', fn);
        };
      }
    };
    //兼容KISSY的ready和JSON，没有才用原生模拟的
    me.JSON = KISSY.JSON || JSON || {};
    me.guid = KISSY.guid || function(){
      return +new Date;
    }
    
    var args = Array.prototype.slice.apply(arguments, 1);
    //agent代表sandbox的iframe环境
    if(agent){
      me['agentInit'].apply(me, args);
      queue = new Queue[me['agentSend']];
      me['agentBind']();
    }else{
      me['init'].apply(me, args);
      queue = new Queue[me['send']];
      me['bind']();
    }
  }
  
  Sandbox.prototype = {
    guid: null,
    ready: null,
    JSON: null,
    source: null, //消息对象
    sourceUrl: null, //消息来源
    callbacks: null, //对于通信，每个消息收到后可以执行一个cb，前提是通过id吧消息和cb关联起来
    //url是要通过沙箱处理的url
    init: function(root, url){
      var me = this;
      //由于是用于同域的通信
      me.sourceUrl = location.origin;
      mw.callbacks = {};
      var iframe = document.createElement('iframe');
        iframe.src = root + '/sandbox.html?' + url,
        body = document.body;

      iframe.style.display = 'none';
      body.appendChild(iframe);
      iframe.onload = function () {
        //通过向iframe中发送__ping__,而iframe向主域发送__pong__实现了双向通信
        //当然要保证source和origin一致
        iframe.contentWindow.postMessage('__ping__', me.sourceUrl);
      };
    },
    agentInit: function(){
      if(win.location.search.substring(1)){
        this.ready(function(){
          queue.ready();
        })
      }
    },
    /**
     * [send description]
     * @param  {[type]} eventdata [description]
     * @return {[type]}           [description]
     * @example
     * eventdata = "{what: {}, guid: xx}"
     */
    send: function(eventdata){
      var source = this.source,
          sourceUrl = this.sourceUrl;
      source.postMessage(eventdata, sourceUrl);
    },
    agentSend: function(){
      var source = this.source,
          sourceUrl = this.sourceUrl;
        //在sandbox的iframe中
      var JSON = this.JSON, 
          data = JSON.parse(eventdata),
          result;
      try {
        //getObjectData，比如参数object1.attr1.attr2返回的是window[object1][attr1][attr2]如果有的话
        result = JSON.stringify({ guid: data.guid, data: this.getObjectData(data.what) });
      } catch (e) {
        result = JSON.stringify({ guid: data.guid, data: undefined });
      }
      //第二个参数是域host，表示向哪个url发送消息,而url是通过监听message消息获得的，在ready之前只有发现事件源就加入队列
      source.postMessage(result, sourceUrl);
    },
    bind: function(){
      var me = this,
          JSON = me.JSON,
          sourceUrl = me.sourceUrl，
          callbacks = me.callbacks;
      addEvent('message', function(event){
        if (event.origin === sourceUrl) { //来源一致
          if (event.data === '__pong__') {
            me.source = event.source;
            queue.ready();//把队列中的数据都发送出去
          } else {
            var result = JSON.parse(event.data),
                guid = result.guid;
            if (callbacks[guid]) {
              callbacks[guid](result.data);
            }
          }
        }
      });
    },
    agetnBind: function(){
      var me = this,
          JSON = me.JSON;
      addEvent('message', function(event){
          if (event.data === '__ping__') {
              //消息对象是通过event来传递的
              me.source = event.source;
              //同样，来源url也是event有记录
              me.sourceUrl = event.origin;
              me.source.postMessage('__pong__', me.sourceUrl);
            } else {
              queue.push(event.data);
            }
          });
        }
    },
    getObjectData: function(path, context) {
      var props = path.split('.'),
          length = props.length,
          i = 1,
          currentProp = context || win,
          value = currentProp[path];
      try {
        if (currentProp[props[0]] !== undefined) {
          currentProp = currentProp[props[0]];
          for (; i < length; i++) {
            if (typeof currentProp[props[i]] === undefined) {
              break;
            } else if (i === length - 1) {
              value = currentProp[props[i]];
            }
            currentProp = currentProp[props[i]];
          }
        }
      } catch (e) {
        value = undefined;
      }
    
      return value;
    },
    pingCB: function(what, callback){
      var guid = this.guid('sandbox_'),
          callbacks = this.callbacks;
      callbacks[guid] = callback;
      queue.push(JSON.stringify({ guid: guid, what: what }));
    }
  };
  
  
  初始化沙箱，内部启动监听message消息
  var sandbox = new Sandbox();
  //对于主域，可以添加消息和callback，在接收到子域iframe的消息时，处理回调。
  //而对于子域iframe，会在domready时处理过来的消息，返回消息处理好得数据
  //相当于主域向子域要东西，请求并且拿到后，继续执行主域的方法。
}(window));