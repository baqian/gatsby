// if a gist has been requested, lazy load the gist library and plug it in
if (/gist\/\d+/.test(window.location.pathname) && (!sessionStorage.getItem('javascript') && !sessionStorage.getItem('html'))) {
  window.editors = editors; // needs to be global when the callback triggers to set the content
  loadGist = function () {
    $.getScript('/js/chrome/gist.js', function () {
      window.gist = new Gist(window.location.pathname.replace(/.*?(\d+).*/, "$1"));
    });
  };
  
  if (editors.ready) {
    loadGist();
  } else {
    $document.on('jsbinReady', loadGist);
  }
}


window.CodeMirror = CodeMirror; // fix to allow code mirror to break naturally

// ignore this browser control - should set focus to browser
delete CodeMirror.keyMap['default']['Cmd-L'];


var link = document.createElement('link');
link.rel = 'stylesheet';
link.href = jsbin['static'] + '/css/font.css?' + jsbin.version;
link.type = 'text/css';
document.getElementsByTagName('head')[0].appendChild(link);

if (jsbin.embed) {
  analytics.embed();
}



;(function(S){
  var location = window.location,
      search = location.search,
      hash = location.hash,
      pathname = location.pathname;
  var win = window,
      doc = window.document,
      body = doc.body;
  S.augment(Gatsby, {
    $attrs: {},
    get: function(key){
      return this.$attrs[key];
    },
    set: function(key, value){
      this.$attrs[key] = value;
    },
    getUrl: function(){
      
    },
    UA: S.UA,
    hashJumpEdit: function(){
      var editReg = /#\/.*?\/(\d+\/)?edit/i;
      if(hash && editReg.test(hash)){
        var root = this.get('root');
        window.location = root + hash.substring(1) + search;
      }
    },
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
    bindDownload: function(){
      var self = this;
      S.one('#download').on('click', function(e){
        e.preventDefault();
        window.loation = self.getURL() + '/download';
      });
    }
  });
})(KISSY);

