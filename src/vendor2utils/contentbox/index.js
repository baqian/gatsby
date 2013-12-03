KISSY.add(function(S, Base, Node, Event, MU){
	var TPL = [
		'<div class="contentbox-wrapper">',
			'<div class="contentbox-target">',
				'{{{target}}}',
			'</div>',
			'<div class="contentbox-box">',
				'<a class="contentbox-close" href="javascript:;">X</a>',
				'<h5 class="summary">{{header}}</h5>',
				'<div class="contentbox-edit">',
					'<div class="contentbox-note">',
						'{{#notes}}',
						'{{#mine}}',
						'<div class="content-mine">',
							'<div class="tips-wrapper">',
								'<b class="arrow"><i></i></b>',
								'<div class="tips-content">',
									'{{{content}}}',
								'</div>',
							'</div>',
							'<div class="avatar">',
								'<div class="pic"><img src="{{src}}"/></div>',
								'<div class="title">{{title}}</div>',
							'</div>',
						'</div>',
						'{{/mine}}',
						'{{^mine}}',
						'<div class="content-other">',
							'<div class="tips-wrapper">',
								'<b class="arrow"><i></i></b>',
								'<div class="tips-content">',
									'{{{content}}}',
								'</div>',
							'</div>',
							'<div class="avatar">',
								'<div class="pic"><img src="{{src}}"/></div>',
								'<div class="title">{{title}}</div>',
							'</div>',
						'</div>',
						'{{/mine}}',
						'{{/notes}}',
						'<div class="content-mine content-input">',
							'<div class="avatar">',
								'<div class="pic"><img src="{{src}}"/></div>',
								'<div class="title">{{title}}</div>',
							'</div>',
							'<div class="content-form">',
								'<form action="{{action}}" method="post">',
									'<input type="text" name=""/><button type="submit" >发送</button>',
								'</form>',
							'</div>',
						'</div>',
					'</div>',
				'</div>',
			'</div>',
		'</div>'
	].join('');
	
	function ContentBox(){
		ContentBox.superclass.constructor.apply(this, arguments);
		this.initialize();
	}
	
	ContentBox.ATTRS = {
		container: {
			
		},
		height: {
			
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
		data: {
			
		}
	}
	
	var hookCls = '.contentbox-hook',
		elCls = '#J_appcontent', 
		wrapperCls = '.contentbox-wrapper',
		targetCls = '.contentbox-target',
		boxCls = '.contentbox-box',
		closeCls = '.contentbox-close',
		noteCls = '.contentbox-note';
		
	S.extend(ContentBox, Base, {
		el: null,
		initialize: function(){
			var self = this,
				el = self.el,
				container = self.get('container'),
				height = self.get('height'),
				target = self.get('target');
			Array.prototype.each = Array.prototype.forEach;
			if(!target){
				target = S.all(hookCls);
			}
			
			if(!el){
				self.el = el = S.one(elCls) || new Node('<div id="J_appcontent" class="hao321-app-content"></div>').appendTo(container);
			}
			if(height){
				self.height = height;
			}else{
				self.height = container.height();
			}
			
			target.each(function(tg){
				tg.on('click', function(e){
					e.halt();
					var item = tg.parent(), ditem = item[0], id = ditem.contentId;
					if(id){
						if(ditem.clicked){
							ditem.clicked = false;
							var wrapper = el.one('#' + id);
							if(wrapper){
								self._hideWrapper(wrapper);
								return;
							}
						}else{
							ditem.clicked = true;
							var wrapper = el.one('#' + id);
							if(wrapper){
								self._showWrapper(wrapper);
								return;
							}
						}
					}
					
					id = self._render(item);
					ditem.contentId = id;
					ditem.clicked = true;
				});
			});
		},
		_stampId: function(){
			return S.guid('contentbox_');
		},
		height: null,
		_showWrapper: function(wrapper){
			var self = this,
				el = self.el,
				box = wrapper.one(boxCls),
				container = self.get('container'),
				height = self.height;
				
			el.show();
			var toHeight = box.offset().top +  box.height();
			if(toHeight > height){
				el.height(toHeight);
				container.height(toHeight);
			}else{
				toHeight = height;
			}
			self.fire('beforeShow', {height: toHeight});
		},
		_hideWrapper: function(wrapper){
			var self = this,
				el = self.el,
				container = self.get('container'),
				height = self.height;
			el.hide();	
			container.height(height);
			self.fire('beforeHide', {height: height});
		},
		_render: function(item){
			var self = this,
				el = self.el,
				data = self.get('data'),
				id = self._stampId();
				
			data['target'] = item.outerHTML();
			data['header'] = item.one('.summary').text();
			
			el.html(MU.render(TPL, data));
			var wrapper = el.one(wrapperCls);
			self._relocate(el, wrapper, item);
			self._showWrapper(wrapper);
			self._bind(wrapper);
			return id;
		},
		_relocate: function(el, wrapper, target){
			el.css({'visibility': 'hidden', 'display': 'block'});
			var ost = S.merge(target.offset(), {width: target.width(), height: target.height()}),
				ostTop = ost.top - 30 - 10,//30是吊顶高度
				box = wrapper.one(boxCls),
				boxWidth = box.width();
			if((ost.left + ost.width + boxWidth + 50) > el.width()){
				wrapper.addClass('contentbox-wrapper-right');
				wrapper.one(targetCls).css('left', boxWidth + ost.width + 10);
				box.css('left', ost.width + 10);
				wrapper.css({
					left: ost.left - 10 - boxWidth - ost.width, //10是边距
					top: ostTop
				});
			}else{
				box.css('left', ost.width + 10);
				wrapper.css({
					left: ost.left - 10, //10是边距
					top: ostTop
				});
			}
			
			if(ost.top - 30 - 20 - box.height() > 0){
				box.addClass('contentbox-box-bottom');
				box.css({top: ost.height - 15 - box.height()});
			}
			el.css({'visibility': 'visible', 'display': 'none'});
		},
		_bind: function(wrapper){
			var self = this,
				closeBtn = wrapper.one(closeCls);
			closeBtn.on('click', function(e){
				self._hideWrapper(wrapper);
			});
		}
	});
	
	return ContentBox;
},{
	requires: [
		'base',
		'node',
		'event',
		'mustache',
		'./index.css'
	]
});