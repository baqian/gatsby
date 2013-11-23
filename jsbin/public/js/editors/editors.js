//= require "codemirror"
//= require "mobileCodeMirror"
//= require "library"
//= require "unsaved"
//= require "panel"
//= require "../render/live"
//= require "../render/console"
//= require "keycontrol"
//= require "../processors/processor"

var panels = {};

var $window = $(window);

//把显示的panel算出来
panels.getVisible = function () {
  var panels = this.panels,
      visible = [];
  for (var panel in panels) {
    if (panels[panel].visible) visible.push(panels[panel]);
  }
  return visible;
};

panels.save = function () {
  // 如果是嵌入访问，则不保存，其中服务器会设置jsbin.embed=true
  if (jsbin.embed) {
    return;
  }

  var visible = this.getVisible(),
      state = {},
      panel,
      left = '',
      width = $window.width();//窗口大小

  for (var i = 0; i < visible.length; i++) {
    panel = visible[i];
    left = panel.$el.css('left');
    if (left.indexOf('%') === -1) {
      //如果不是百分比，则换算成百分比
      left = (parseFloat(left)  / width * 100) + '%';
    }
    //拿到可视panel的所有分隔点
    state[panel.name] = left;
  }

  //存到sessionStorage中
  sessionStorage.setItem('jsbin.panels', JSON.stringify(state));
}

panels.restore = function () {
  // if there are panel names on the hash (v2 of jsbin) or in the query (v3)
  // then restore those specific panels and evenly distribute them.
  var open = [],
      location = window.location,
      search = location.search.substring(1),//参数值
      hash = location.hash.substring(1),//hash值
      //其中url?a,b或者url#a,b是指定了a,b panel
      toopen = search || hash ? (search || hash).split(',') : jsbin.settings.panels || [],
      //如果是嵌入，则不需要panel的打开状态
      state = jsbin.embed ? null : JSON.parse(sessionStorage.getItem('jsbin.panels') || 'null'),
      //我是发现了editors[mode].getCode()是可以拿到指定panel的内容的
      hasContent = {
        javascript: editors.javascript.getCode().length,
        css: editors.css.getCode().length,
        html: editors.html.getCode().length
      },
      name = '',
      i = 0,
      panel = null,
      init = [],
      panelURLValue = '',
      openWithSameDimensions = false,
      width = $window.width(),
      deferredCodeInsert = '',
      focused = !!sessionStorage.getItem('panel');//焦点panel
  //直接更新url，根目录或者edit时转接到标准页面
  if (history.replaceState && (location.pathname.indexOf('/edit') !== -1) || ((location.origin + location.pathname) === jsbin.getURL() + '/')) {
    history.replaceState(null, '', jsbin.getURL() + (jsbin.getURL() === jsbin.root ? '' : '/edit'));
  }

  //默认打开这3个panel
  if (toopen.length === 0 && state === null) {
    if (hasContent.javascript) toopen.push('javascript');
    if (hasContent.html) toopen.push('html');
    if (hasContent.css) toopen.push('css');
    toopen.push('live');//并且多加控制台
  }

  // otherwise restore the user's regular settings
  // also set a flag indicating whether or not we should save the panel settings
  // this is based on whether they're on jsbin.com or if they're on an existing
  // bin. Also, if they hit save - *always* save their layout.
  if (location.pathname && location.pathname !== '/') {
    panels.saveOnExit = false;
  } else {
    panels.saveOnExit = true;
  }

  // TODO decide whether the above code I'm trying too hard.

  /* Boot code */
  // then allow them to view specific panels based on comma separated hash fragment/query
  if (toopen.length) {
    for (name in state) {
      if (toopen.indexOf(name) !== -1) {
        i++;
      }
    }
    //判断要打开panel和可视的panel都包括的，则按可视中panel的百分比大小来打开
    if (i === toopen.length) openWithSameDimensions = true;

    for (i = 0; i < toopen.length; i++) {
      panelURLValue = '';
      name = toopen[i];

      //url?a=via,b=vib这样的形式，可以抓到url
      if (name.indexOf('=') !== -1) {
        panelURLValue = name.substring(name.indexOf('=') + 1);
        name = name.substring(0, name.indexOf('='));
      }

      if (panels.panels[name]) {
        panel = panels.panels[name]; //name = panelId
        // console.log(name, 'width', state[name], width * parseFloat(state[name]) / 100);
        //如果有编辑器，则直接打开url中的内容
        if (panel.editor && panelURLValue) {
          panel.setCode(decodeURIComponent(panelURLValue));
        }

        //好高panel的尺寸
        if (openWithSameDimensions && toopen.length > 1) {
          panel.show(width * parseFloat(state[name]) / 100);
        } else {
          panel.show();
        }
        
        
        init.push(panel);
      } else if (name && panelURLValue) { // TODO support any varible insertion
        (function (name, panelURLValue) {
          var todo = ['html', 'javascript', 'css'];

          var deferredInsert = function (event, data) {
            var code, parts, panel = panels.panels[data.panelId] || {};

            if (data.panelId && panel.editor && panel.ready === true) {
              //从列表中除去
              todo.splice(todo.indexOf(data.panelId), 1);
              try {
                //尝试拿到代码
                code = panel.getCode();
              } catch (e) {
                // this really shouldn't happen
                // console.error(e);
              }
              //替换xxxx%a%xxxx位xxxviaxxx
              if (code.indexOf('%' + name + '%') !== -1) {
                parts = code.split('%' + name + '%');
                code = parts[0] + decodeURIComponent(panelURLValue) + parts[1];
                panel.setCode(code);
                $document.unbind('codeChange', deferredInsert);
              }
            }

            if (todo.length === 0) {
              $document.unbind('codeChange', deferredInsert);
            }
          };
          //每次代码改动都取作变换，其中只针对javascript,html,css的代码作变量处理，
          //只作一次替换，后面不在继续
          $document.bind('codeChange', deferredInsert);
        }(name, panelURLValue));
      }
    }

    // 如果url?a a==preview，则只输出控制台
    if (toopen.length === 1 && toopen[0] === 'preview') {
      panels.panels.live.show();
    }
    //如果panel中有新要打开的，拿尺寸需要均分，包括如果时横向的，需要横向均分
    if (!openWithSameDimensions) this.distribute();
  } else {
    //只算默认打开的panels
    for (name in state) {
      panels.panels[name].show(width * parseFloat(state[name]) / 100);
    }
  }

  // now restore any data from sessionStorage
  // TODO add default templates somewhere
  // var template = {};
  // for (name in this.panels) {
  //   panel = this.panels[name];
  //   if (panel.editor) {
  //     // panel.setCode(sessionStorage.getItem('jsbin.content.' + name) || template[name]);
  //   }
  // }
  //一开始所有要打开的panel都加入到了init，现在遍历取调用初始化
  for (i = 0; i < init.length; i++) {
    init[i].init();
  }
  //指定焦点panel
  var visible = panels.getVisible();
  if (visible.length) {
    $body.addClass('panelsVisible');
    if (!focused) {
      visible[0].show();
    }
  }

};

panels.savecontent = function () {
  // sessionStorage保存各panel内容
  var name, panel;
  for (name in this.panels) {
    panel = this.panels[name];
    if (panel.editor) sessionStorage.setItem('jsbin.content.' + name, panel.getCode());
  }
};

//才发现panel.id时panel的className
panels.focus = function (panel) {
  this.focused = panel;
  if (panel) {
    $('.panel').removeClass('focus').filter('.' + panel.id).addClass('focus');
  }
}

// 分配panel窗口和尺寸，包括url中带的窗口
// url?a,b有2个意义：窗口panelId和变量
panels.distribute = function () {
  var visible = $('#source .panelwrapper:visible'),
      width = 100,
      height = 0,
      innerW = $window.width() - (visible.length - 1), //边框占了一像素，4个panel有3个边
      innerH = $('#source').outerHeight(),
      left = 0,
      right = 0,
      top = 0,
      panel,
      nestedPanels = [];

  if (visible.length) {
    $body.addClass('panelsVisible');

    // visible = visible.sort(function (a, b) {
    //   return a.order < b.order ? -1 : 1;
    // });

    width = 100 / visible.length;
    for (var i = 0; i < visible.length; i++) {
      panel = $.data(visible[i], 'panel');
      right = 100 - (width * (i+1));
      panel.$el.css({ top: 0, bottom: 0, left: left + '%', right: right + '%' });
      panel.splitter.trigger('init', innerW * left/100);
      panel.splitter[i == 0 ? 'hide' : 'show']();
      left += width;

      nestedPanels = $(visible[i]).find('.panel');
      //横向分隔
      if (nestedPanels.length > 1) {
        top = 0;
        nestedPanels = nestedPanels.filter(':visible');
        height = 100 / nestedPanels.length;
        nestedPanels.each(function (i) {
          bottom = 100 - (height * (i+1));
          var panel = jsbin.panels.panels[$.data(this, 'name')];
          // $(this).css({ top: top + '%', bottom: bottom + '%' });
          $(this).css('top', top + '%');
          $(this).css('bottom', bottom + '%' );
          if (panel.splitter.hasClass('vertical')) {
            panel.splitter.trigger('init', innerH * top/100);
            panel.splitter[i == 0 ? 'hide' : 'show']();
          }
          top += height;
        });
      }
    }
  } else {
    //显示操作历史，调用list和quiet
    $('#history').show();
    setTimeout(function () {
      $body.removeClass('panelsVisible');
    }, 100); // 100 is on purpose to add to the effect of the reveal
  }
};

//panel时显示了，同时也需要其中的编辑器为焦点，
//因为控制台时没有编辑器的，所以需要作判断
panels.show = function (panelId) {
  this.panels[panelId].show();
  if (this.panels[panelId].editor) {
    this.panels[panelId].editor.focus();
  }
  this.panels[panelId].focus();
};

panels.hide = function (panelId) {
  var $history = $('#history'); // TODO shouldn't have to keep hitting this
  var panels = this.panels;
  if (panels[panelId].visible) {
    panels[panelId].hide();
  }
  //如果有则关掉，并且编辑器焦点回到上一个panel
  var visible = jsbin.panels.getVisible();
  if (visible.length) {
    jsbin.panels.focused = visible[0];
    if (jsbin.panels.focused.editor) {
      jsbin.panels.focused.editor.focus();
    } else {
      jsbin.panels.focused.$el.focus();
    }
    jsbin.panels.focused.focus();
  } else if ($history.length && !$body.hasClass('panelsVisible')) {
    //但所有panel都关闭完了，则显示操作历史
    $body.toggleClass('dave', $history.is(':visible'));
    $history.toggle(100);
  } else if ($history.length === 0) {
    // TODO load up the history
  }
};

//全部都关掉，直接出操作历史
panels.hideAll = function () {
  var visible = panels.getVisible(),
      i = visible.length;
  while (i--) {
    visible[i].hide();
  }
};

// dirty, but simple
Panel.prototype.distribute = function () {
  panels.distribute();
};

jsbin.panels = panels;

var ignoreDuringLive = /^\s*(while|do|for)[\s*|$]/;


var panelInit = {
  html: function () {
    var init = function () {
      // set cursor position on first blank line
      // 1. read all the inital lines
      var lines = this.editor.getValue().split('\n'),
          blank = -1;
      lines.forEach(function (line, i) {
        if (blank === -1 && line.trim().length === 0) {
          blank = i;
          //exit
        }
      });

      if (blank !== -1) {
        //从第一个空行那里设置焦点
        this.editor.setCursor({ line: blank, ch: 2 });
        if (lines[blank].length === 0) {
          this.editor.indentLine(blank, 'add');//添加add提示
        }
      }
    };
    //初始化panel，指定是否要初始化编辑器，title，和初始化
    return new Panel('html', { editor: true, label: 'HTML', init: init });
  },
  css: function () {
    return new Panel('css', { editor: true, label: 'CSS' });
  },
  javascript: function () {
    return new Panel('javascript', { editor: true, label: 'JavaScript' });
  },
  console: function () {
    // hide and show callbacks registered in console.js
    return new Panel('console', { label: 'Console' });
  },
  live: function () {
    function show() {
      // var panel = this;
      if (panels.ready) {
        renderLivePreview();
      }
    }

    function hide() {
      // detroy the iframe if we hide the panel
      // note: $live is defined in live.js
      // Commented out so that the live iframe is never destroyed
      if (panels.panels.console.visible === false) {
        // $live.find('iframe').remove();
      }
    }
    //指定2个回调～
    return new Panel('live', { label: 'Output', show: show, hide: hide });
  }
};

var editors = panels.panels = {};

// show all panels (change the order to control the panel order)
// 不管如何，先初始化5个panel
editors.html = panelInit.html();
editors.css = panelInit.css();
editors.javascript = panelInit.javascript();
editors.console = panelInit.console();
upgradeConsolePanel(editors.console); //神马
editors.live = panelInit.live();

// jsconsole.init(); // sets up render functions etc.
// 神马
editors.live.settings.render = function (showAlerts) {
  if (panels.ready) {
    renderLivePreview(showAlerts);
  }
};

// IMPORTANT this is nasty, but the sequence is important, because the
// show/hide method is being called as the panels are being called as
// the panel is setup - so we hook these handlers on *afterwards*.
// panels.update = function () {
//   var visiblePanels = panels.getVisible(),
//       visible = [],
//       i = 0;
//   for (i = 0; i < visiblePanels.length; i++) {
//     visible.push(visiblePanels[i].name);
//   }

//   if (history.replaceState) {
//     history.replaceState(null, null, '?' + visible.join(','));
//   } else {
//     // :( this will break jquery mobile - but we're talking IE only at this point, right?
//     location.hash = '#' + visible.join(',');
//   }
// }


// Panel.prototype._show = Panel.prototype.show;
// Panel.prototype.show = function () { 
//   this._show.apply(this, arguments);
//   panels.update();
// }

// Panel.prototype._hide = Panel.prototype.hide;
// Panel.prototype.hide = function () { 
//   this._hide.apply(this, arguments);
//   panels.update();
// }

//向让所有嗲有编辑器的panel加一个回调函数执行，可能要统一什么东西把
panels.allEditors = function (fn) {
  var panelId, panel;
  for (panelId in panels.panels) {
    panel = panels.panels[panelId];
    if (panel.editor) fn(panel);
  }
};

//先让panels初始化，然后10后执行这个，这个js。。
setTimeout(function () {
  panels.restore();
}, 10);
panels.focus(panels.getVisible()[0] || null);

// allow panels to be reordered - TODO re-enable
(function () {
  return; // disabled for now

  var panelsEl = document.getElementById('panels'),
      moving = null;

  panelsEl.ondragstart = function (e) { 
    if (e.target.nodeName == 'A') {
      moving = e.target;
    } else {
      return false;
    }
  };

  panelsEl.ondragover = function (e) { 
    return false; 
  };

  panelsEl.ondragend = function () { 
    moving = false;
    return false; 
  };

  panelsEl.ondrop = function (e) {
    if (moving) {

    }
    return false;
  };

});

//为什么要这么弄呢，时因为有些窗口可以指定不同语言的，如果语言不存在，则下载
var editorsReady = setInterval(function () {
  var ready = true,
      resizeTimer = null,
      panel,
      panelId;

  for (panelId in panels.panels) {
    panel = panels.panels[panelId];
    if (panel.visible && !panel.ready) ready = false;
  }

  panels.ready = ready;

  if (ready) {
    clearInterval(editorsReady);
    // panels.ready = true;
    // if (typeof editors.onReady == 'function') editors.onReady();
    // panels.distribute();

    // if the console is visible, it'll handle rendering of the output and console
    if (panels.panels.console.visible) {
      editors.console.render();
    } else {
      // otherwise, force a render
      renderLivePreview();
    }


    $(window).resize(function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        $document.trigger('sizeeditors');
      }, 100);
    });

    $document.trigger('sizeeditors');
    $document.trigger('jsbinReady');
  }
}, 100);
