KISSY.add(function(S, Base, Event, Node, MU){
	
	var TPL = [
		'<div class="hao321-app-interbox">',
			'<div class="hao321-app-box interbox-wrapper">',
				'<h3>{{header}}</h3>',
				'<s class="arrow-outer"><s class="arrow-inner"></s></s>',
				'<div class="hao321-app-clone">{{{target}}}</div>',
				'<div class="hao321-apps interbox-box">',
					'{{#items}}',
						'<div class="hao321-app-item">',
							'<div class="pic"><a href="{{url}}">{{{img}}}</a></div>',
							'<h5 class="summary"><a href="{{url}}">{{title}}</a></h5>',
						'</div>',
					'{{/items}}',
				'</div>',
			'</div>',
			'<div class="hao321-interlayout">',
				'<s class="arrow-outer"></s>',
			'</div>',
		'</div>'
	].join('');
	
	function InterBox(){
		InterBox.superclass.constructor.apply(this, arguments);
		this.initialize();
	}
	
	InterBox.ATTRS = {
		container: {
			
		},
		boxHeight: {
			value: 300
		},
		target: {
			setter: function(tg){
				var tgs;
				if(S.isArray(tg)){
					tgs = S.one(tg[0]);
					for(var i = 1, len = tg.length; i < len; i++){
						tgs.add(S.one(tg[i]));
					}
				}else if(S.isString(tg)){
					tgs = S.all(tg);
				}else{
					tgs = tg;
				}
				return tgs;
			}
		},
		getHeight: {
			
		},
		rendered: {
			
		}
	}
	
	var elCls = '.hao321-app-interbox',
		hookCls = '.interbox-hook',
		wrapperCls = '.interbox-wrapper',
		boxCls = '.interbox-box',
		cloneCls = '.hao321-app-clone',
		titleCls = '.title-hook';
	S.extend(InterBox, Base, {
		stampId: function(){
			return S.guid('J_interbox');
		},
		height: null,
		boxHeights: {},
		initialize: function(){
			var self = this,
				fn = this.get('rendered');
				target = S.get('target');
			Array.prototype.each = Array.prototype.forEach;
			if(!target){
				target = S.all(hookCls);
			}
			self.height = self.get('container').height();
			target.each(function(item){
				if(item[0].interbox){
					return;
				}
				item[0].interbox = true;
				item.on('click', function(e){
					var id = item.attr('aid'),
						el;
					if(id){
						el = S.one('#' + id);
						if(el[0].clicked){
							el[0].clicked = false;
							self._hideWrapper(el, item);
						}else{
							el[0].clicked = true;
							self._showWrapper(el, item);
						}
					}else{
						id = self.stampId();
						item.attr('aid', id);
						el = self._render(item);
						el.attr('id', id);
						el[0].clicked = true;
						self._showWrapper(el, item);
						fn && fn(el);
					}
				});
			});
			
		},
		_render: function(target){
			var self = this,
				container = self.get('container'),
				data = {};
			var summary = target.one(titleCls);
			summary.hide();
			data['header'] = S.trim(summary.text());
			data['target'] = target.outerHTML().replace(hookCls.slice(1), '');
			
			//也不做分离了，app和box绑定在一个组件里
			var items  = [];
			function getImg(img){
				return img[0].outerHTML.replace('20x20', '100x100');
			}
			target.all('li').each(function(li){
				var a = li.one('a'),
					img = a.one('img');
				items.push({url: a[0].href, img: getImg(img), title: img.attr('alt')});
			});
			data['items'] = items;
			var el = new Node(MU.render(TPL, data)).appendTo(container);
			
			var newTarget = el.one(cloneCls);
			self._relocate(el, target, newTarget);
			self._bind(el, target, newTarget);
			return el;
		},
		_relocate: function(el, target, newTarget){
			el.css({'visibility': 'hidden', 'display': 'block'});
			var self = this,
				ost = S.merge(target.offset(), {width: target.outerWidth(), height: target.outerHeight()}),
				wrapper = el.one(wrapperCls);
			
			var top = ost.top + ost.height; 
			wrapper.css({'marginTop': top - 30});
			
			newTarget.css({
				left: ost.left,
				top: ost.top - top //30是标题和12加起来的
			});
			//给箭头定位
			el.all('.arrow-outer').each(function(arrow){
				arrow.css({
					left: ost.left + ost.width/2,
					top: ost.top + ost.height - top - 32
				});
			});
			var getHeight = self.get('getHeight'),
				id = target.attr('aid');
			if(getHeight){
				self.boxHeights[id] = getHeight(el.one(wrapperCls));
			}else{
				self.boxHeights[id] = self.get('boxHeight');
			}
			
			el.css({'visibility': 'visible', 'display': 'none'});
		},
		_bind: function(el, target, newTarget){
			var self = this;
			newTarget.on('click', function(){
				self._hideWrapper(el, target);
				el[0].clicked = false;
			});
			
			var wrapper = el.one(wrapperCls);
			el.on('mouseup', function(e){
				if(e.target.className === elCls.slice(1) && el[0].clicked){
					var ost = wrapper.offset();
					if(e.clientY < ost.top || e.clientY > (ost.top + wrapper.height())){
						self._hideWrapper(el, target);
						el[0].clicked = false;
					}
				}
			});
		},
		wrapperAnim: null,
		containerAnim: null,
		_hideWrapper: function(el, target){
			var self = this,
				container = self.get('container'),
				wrapper = el.one(wrapperCls),
				height  = self.height;
			self.containerAnim && self.containerAnim.stop();
			self.wrapperAnim && self.wrapperAnim.stop();
			
			self.fire('beforeHide', {height: height});
			
			container.height(height);
			wrapper.height(0);
			el.hide();
			target.one(titleCls).show();
		},
		_showWrapper: function(el, target){
			var self = this,
				id = el.attr('id'),
				wrapper = el.one(wrapperCls),
				container = self.get('container'),
				boxHeight = self.boxHeights[id];
			
			el.show();
			target.one('.summary').hide();
			
			var height = wrapper.offset().top + boxHeight + 20;
			self.fire('beforeShow', {height: height});
			
			self.containerAnim = container.animate({height: height}, 0.9, 'easeOut');
			self.wrapperAnim = wrapper.animate({height: boxHeight + 26}, 1, 'easeOut');
			
		}
	});
	
	return InterBox;
},{
	requires: [
		'base',
		'event',
		'node',
		'mustache',
		'anim',
		'./index.css'
	]
});