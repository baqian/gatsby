KISSY.add(function(S, Base, UA){
  
  function KeyControl(){
    KeyControl.superclass.contructor.apply(this, arguments);
  }
  
  KeyControl.ATTRS = {
    useAlt: {
      value: false
    },
    os: {
      value: UA.os
    }  
  }
  
  S.extend(KeyControl, Base, {
    metaKey: UA.os? 'cmd' : 'ctrl',
    shiftKey: 'shift',
    altKey: 'alt',
    enableAlt: function(){
      this.set('useAlt', true);
    },
    unableAlt: function(){
      this.set('useAlt', false);
    }
    getCodeKey: function(keyCodes, which){
      for(var k in keyCodes){
        if(which === keyCodes[k]){
          return k.toLowerCase();
        }
      }
    },
    getKey: function(e){
      var self = this,
          useAlt = self.get('useAlt'),
          altKey = useAlt? e.altKey : !e.altKey,
          keyCodes = e.keyCodes,
          which = e.which,
          keys = [];
      if(useAlt && e.altKey){
        keys.push(self.altKey);
      }
      if(e.metaKey){
        keys.push(self.metaKey);
      }
      if(e.shiftKey){
        keys.push(self.shiftKey);
      }
      if(which != keyCodes.CTRL && which != keyCodes.META && which != keyCodes.ALT && which != keyCodes.SHIFT){
        keys.push(self.getCodeKey(keyCodes, which));
        e.preventDefault();
      }
      return keys.join('+');
    }
  });
  
  return KeyControl;
}, {
  requires: [
    'base',
    'ua'
  ]
});
