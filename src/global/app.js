




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
    Loader: S.Loader,
    UA: S.UA
  }
  
  
  S.augment(Gatsby, {
    getUrl: function(){
      //todo
    },
    
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

