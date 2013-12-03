KISSY.add(function(S, Base, Node, Event){
	var body = S.one('body');
	function Toslide(){
		Toslide.superclass.constructor.apply(this, arguments);
		this.initialize();
	}
	
	Toslide.ATTRS = {
		el: {
			setter: function(el){
				var els;
				if(S.isArray(el)){
					els = S.one(el[0]);
					for(var i = 1, len = el.length; i < len; i++){
						els.add(S.one(el[i]));
					}
				}else if(S.isString(el)){
					els = S.all(el);
				}else{
					els = el;
				}
				return els;
			}
		},
		line: {
			value: 2
		},
		itemCls: {
			value: '.hao321-app-item'
		},
		baseHeight: {
			
		}
	}
	var hookCls = '.toslide-hook',
		wrapperCls = 'toslide-wrapper',
		panelCls = 'toslide-panel',
		leftCls = '.toslide-left',
		rightCls = '.toslide-right';
	S.extend(Toslide, Base, {
		panels: {},
		activeIndex: {},
		initialize: function(){
			var self = this,
				el = self.get('el');
			if(!el){
				el = S.all(hookCls);
			}
			Array.prototype.each = Array.prototype.forEach;
			el.each(function(item){
				if(item[0].toslide){
					return;
				}
				item[0].toslide = true;
				var id = self._render(item);
				if(id){
					item.addClass(hookCls.slice(1));
					self._bind(item, id);
				}
			});
		},
		_render: function(el){
			var self = this,
				itemCls = self.get('itemCls'),
				line = self.get('line'),
				baseHeight = self.get('baseHeight'),
				items = el.all(itemCls),
				len = items.length,
				item = items.item(0),
				lastItem,
				leftBtn = el.one(leftCls),
				rightBtn = el.one(rightCls);
			
			if(!item){
				return false;
			}
			if(baseHeight){
				baseHeight = line * baseHeight;
			}else{
				baseHeight = line * (item.outerHeight() + parseInt(item.css('marginTop')) + parseInt(item.css('marginBottom')));
			}
				
			var gid = +new Date(),
				panels = self.panels,
				activeIndex = self.activeIndex;
			//el[0].gid = gid;
			
			var wrapper = new Node('<div class="' + wrapperCls + '"></div>').appendTo(el),
				panel = new Node('<div class="' + panelCls + '"></div').appendTo(wrapper);
			
			panel.css('visibility', 'visible');
			panels[gid] = [];
			activeIndex[gid] = 0;
			panels = panels[gid]
			panels.push(panel);
			//不搞自适应了，一遍过~
			while(lastItem = items[--len]){
				lastItem = S.one(lastItem);
				var ostY = Math.floor((lastItem.offset().top - item.offset().top) / baseHeight);
				if(len === (items.length - 1)){
					for(var i = 0; i < ostY; i ++){
						var p = new Node('<div class="' + panelCls + '"></div').appendTo(wrapper);
						panels.push(p);
					}
					var plen = panels.length;
					wrapper.width(plen * 100 + '%');
					for(var i = plen; i--;){
						panels[i].width(100 / plen + '%');
					}
				}
				if(ostY){
					lastItem.prependTo(panels[ostY]);
				}else{
					lastItem.prependTo(panel);
				}
			}
			if(panels.length){
				if(!leftBtn){
					leftBtn = new Node('<div class="' + leftCls.slice(1) + '"><span class="toslide-arrow"></span></div>').prependTo(el);
				}
				if(!rightBtn){
					rightBtn = new Node('<div class="' + rightCls.slice(1) + '"><span class="toslide-arrow"></span></div>').appendTo(el);
				}
				
				leftBtn.css({
					top: (baseHeight - 100)/2 + 'px'
				});
				rightBtn.css({
					top: (baseHeight - 100)/2 + 'px'
				});
				return gid
			}else{
				return false;
			}
		},
		_bind: function(el, id){
			var self = this,
				keepEnter,
				event,
				startX,
				bodyWidth = body.width(),
				timer,
				unable = false;
			el.on('mousemove', function(e){
				if(unable) return;
				if((bodyWidth - e.clientX) < 200){
					keepEnter = undefined;
					if(timer){
						timer.cancel();
						timer = undefined;
					}
					self._activeRightBtn(el, id);
					return;
				}
				if(e.clientX < 200){
					keepEnter = undefined;
					if(timer){
						timer.cancel();
						timer = undefined;
					}
					self._activeLeftBtn(el, id);
					return;
				}
				
				event = e;
				if(keepEnter === undefined){
					keepEnter = true;
					startX = event.clientX;
				}
				if(!timer){
					timer = S.later(function(){
						if(keepEnter){
							if((event.clientX - startX) > 200){
								self._activeRightBtn(el, id);
							}
							if((startX - event.clientX) > 200){
								self._activeLeftBtn(el, id);
							}
						}
						keepEnter = undefined;
						timer.cancel();
						timer = undefined;
					}, 500);
				}
			});
			el.on('mouseleave', function(e){
				keepEnter = false;
				if(timer){
					timer.cancel();
					timer = undefined;
				}
			});
			var leftBtn = el.one(leftCls);
			var rightBtn = el.one(rightCls);
			leftBtn.on('mouseenter', function(e){
				unable = true;
				if(self.animHandler){
					self.animHandler.stop();
				}
				if(self.clearTimer){
					self.clearTimer.cancel();
				}
			});
			leftBtn.on('mouseleave', function(e){
				unable = false;
				self.clearTimer = S.later(function(){
					self.clearTimer.cancel();
					leftBtn.hide();
				}, 500);
			});
			rightBtn.on('mouseenter', function(e){
				unable = true;
				if(self.animHandler){
					self.animHandler.stop();
				}
				if(self.clearTimer){
					self.clearTimer.cancel();
				}
			});
			rightBtn.on('mouseleave', function(e){
				unable = false;
				self.clearTimer = S.later(function(){
					self.clearTimer.cancel();
					rightBtn.hide();
				}, 500);
			});
			
			var activeIndex = self.activeIndex[id],
				panels = self.panels[id],
				animHandler =  false;
				wrapper = panels[0].parent();
			leftBtn.on('click', function(e){
				if(animHandler && animHandler.isRunning() || activeIndex == 0) return;
				self.activeIndex[id] = activeIndex = activeIndex - 1;
				var left = activeIndex ? - (100 * activeIndex) + '%': 0;
				animHandler = wrapper.animate({left: - left}, 0.5, 'easeOut', function(){
					panels[activeIndex + 1].css('visibility', 'hidden');
				});
			});
			rightBtn.on('click', function(e){
				if(animHandler && animHandler.isRunning() || activeIndex == (panels.length -1)) return;
				self.activeIndex[id] = activeIndex = activeIndex + 1;
				panels[activeIndex].css('visibility', 'visible');
				animHandler = wrapper.animate({left: - (100 * activeIndex) + '%'}, 0.5, 'easeOut');
			});
		},
		animHandler: null,
		clearTimer: null,
		_activeRightBtn: function(el, id){
			var self = this,
				leftBtn = el.one(leftCls);
				rightBtn = el.one(rightCls);
			if(self.animHandler){
				self.animHandler.stop();
			}
			if(self.clearTimer){
				self.clearTimer.cancel();
			}
			
			leftBtn.hide();
			if(self.activeIndex[id] == (self.panels[id].length - 1)) return;
			self.animHandler = rightBtn.animate({'display': 'block'}, 1, 'easeOut', function(){
				self.clearTimer = S.later(function(){
					self.clearTimer.cancel();
					rightBtn.hide();
				}, 500);
			});
		},
		_activeLeftBtn: function(el, id){
			var self = this,
				rightBtn = el.one(rightCls),
				leftBtn = el.one(leftCls);
			if(self.animHandler){
				self.animHandler.stop();
			}
			if(self.clearTimer){
				self.clearTimer.cancel();
			}
			rightBtn.hide();
			if(self.activeIndex[id] == 0) return;
			self.animHandler = leftBtn.animate({'display': 'block'}, 1, 'easeOut', function(){
				self.clearTimer = S.later(function(){
					self.clearTimer.cancel();
					leftBtn.hide();
				}, 500);
			});
		}
	});
	
	return Toslide;
},{
	requires: [
		'base',
		'node',
		'event',
		'anim',
		'./index.css'
	]
});