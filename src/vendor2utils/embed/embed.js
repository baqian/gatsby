(function (window, document, undefined) {

// exit if we already have a script in place doing this task
if (window.jsbinified !== undefined) return;

/*!
  * domready (c) Dustin Diaz 2012 - License MIT
  */
!function (name, definition) {
  if (typeof module != 'undefined') module.exports = definition()
  else if (typeof define == 'function' && typeof define.amd == 'object') define(definition)
  else this[name] = definition()
}('domready', function (ready) {

  var fns = [], fn, f = false
    , doc = document
    , testEl = doc.documentElement
    , hack = testEl.doScroll
    , domContentLoaded = 'DOMContentLoaded'
    , addEventListener = 'addEventListener'
    , onreadystatechange = 'onreadystatechange'
    , readyState = 'readyState'
    , loaded = /^loade|c/.test(doc[readyState])

  function flush(f) {
    loaded = 1
    while (f = fns.shift()) f()
  }

  doc[addEventListener] && doc[addEventListener](domContentLoaded, fn = function () {
    doc.removeEventListener(domContentLoaded, fn, f)
    flush()
  }, f)


  hack && doc.attachEvent(onreadystatechange, fn = function () {
    if (/^c/.test(doc[readyState])) {
      doc.detachEvent(onreadystatechange, fn)
      flush()
    }
  })

  return (ready = hack ?
    function (fn) {
      self != top ?
        loaded ? fn() : fns.push(fn) :
        function () {
          try {
            testEl.doScroll('left')
          } catch (e) {
            return setTimeout(function() { ready(fn) }, 50)
          }
          fn()
        }()
    } :
    function (fn) {
      loaded ? fn() : fns.push(fn)
    })
});

// ---- here begins the jsbin embed - based on the embedding doc: https://github.com/remy/jsbin/blob/master/docs/embedding.md
//http://qbaok.blog.163.com/blog/static/10129265201011275928960/
var innerText = document.createElement('i').innerText === undefined ? 'textContent' : 'innerText';

var doc = document;
var EmbedObject = {
  innerText: doc.createElement('i').innerText === undefined ? 'textContent' : 'innerText',
  hook: 'hook-gatsby-',
  embedhook: this.hook + 'embed',
  scoophook: this.hook + 'scoop',
  getInnerText: function(elem){
    return elem[this.innerText];
  },
  getEmbedLinks: function(){
    var links = [], 
        alllinks = doc.getElementsByTagName('a'),
        i = allinks.length,
        hook = this.hook,
        link;
    while(link = allinks[--i]){
      if (link.className.indexOf(hook) > -1) {
        links.push(link);
      }
    }
    return links;
  },
  getEmbedCode: function(link){
    var rel = link.rel,
        id = rel.substring(1),
        query = link.search.substring(1),
        element,
        code,
        panels = [];

    if (rel && (element = doc.getElementById(id))) {
      code = this.getInnerText(element);
    } else {
      element = this.findCodeInParent(link);
      if (element) {
        code = this.getInnerText(element);
      }
    }

    return code;
  },
  findCodeInParent: function(elem){
    var match = elem;
    while (match = match.previousSibling) {
      if (match.nodeName === 'PRE') {
        break;
      }
      if (match.getElementsByTagName) {
        match = match.getElementsByTagName('pre');
        if (match.length) {
          match = match[0]; // only grabs the first
          break;
        }
      }
    }

    if (match) return match;

    match = elem.parentNode.getElementsByTagName('pre');

    if (!match.length) {
      if (elem.parentNode) {
        return this.findCodeInParent(elem.parentNode);
      } else {
        return null;
      }
    }

    return match[0];
  },
  detectLanguage: function(code) {
    var htmlcount = (code.split("<").length - 1),
        csscount = (code.split("{").length - 1),
        jscount = (code.split(".").length - 1);

    if (htmlcount > csscount && htmlcount > jscount) {
      return 'html';
    } else if (csscount > htmlcount && csscount > jscount) {
      return 'css';
    } else {
      return 'javascript';
    }
  },
  scoop: function(link) {
    var me = this,
        code = me.findCode(link),
        language = me.detectLanguage(code),
        query = link.search.substring(1);

    if (language === 'html' && code.toLowerCase().indexOf('<html') === -1) {
      // assume this is an HTML fragment - so try to insert in the %code% position
      language = 'code';
    }

    if (query.indexOf(language) === -1) {
      query += ',' + language + '=' + encodeURIComponent(code);
    } else {
      query = query.replace(language, language + '=' + encodeURIComponent(code));
    }

    link.search = '?' + query;
  },
  embed: function(link) {
    var iframe = doc.createElement('iframe'),
        resize = doc.createElement('div');
    iframe.src = link.href;
    iframe._src = link.href; // support for google slide embed
    iframe.className =  this.embedhook;
    iframe.style.border = '1px solid #aaa';
    iframe.style.width = '100%';
    iframe.style.minHeight = '300px';
    link.parentNode.replaceChild(iframe, link);

    var onmessage = function (event) {
      event || (event = window.event);
      iframe.style.height = event.data.height + 'px';
    };

    if (window.addEventListener) {
      window.addEventListener('message', onmessage, false);
    } else {
      window.attachEvent('onmessage', onmessage);
    }
  },
  init: function(){
    window.jsbinified = true;
    domready(function (){
      var me = this,
          links = me.getEmbedLinks(),
          i = links.length,
          link,
          className = '';

      while(link = links[--i]){
        className = link.className;
        if(className.indexOf(me.scoophook) > -1){
          scoop(link);
        }
        if(className.indexOf(me.embedhook) > -1){
          embed(link);
        }
      }
    });
    
  }
}

EmbedObject.init();

}(this, document));