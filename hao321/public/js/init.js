;(function(S){
	
	S.config({
		packages: [{
			name: 'vendor2utils',
			path: '.',
			debug: true
		}],
		modules: {
			'mustache': {fullpath: 'vendor2utils/modules/mustache.js'}
		}
	});
	S.ready(function(){
		S.use('vendor2utils/toslide/, vendor2utils/interbox/, vendor2utils/contentbox/,event,node', function(S, Toslide, Interbox, Contentbox, Event, Node){
			var wrapper = S.one('.hao321-wrapper'),
				boxCls = '.hao321-apps',
				itemCls = '.hao321-app-item',
				item = wrapper.one(itemCls),
				line = 2,
				baseHeight = item.outerHeight() + parseInt(item.css('marginTop')) + parseInt(item.css('marginBottom'));
				
			new Toslide({itemCls: itemCls, line: line, baseHeight: baseHeight});
			
			
			function initContentbox(target){
				var contentbox = new Contentbox({
					target: target,
					height: wrapper.height(),
					container: wrapper,
					data: {
						'notes': [{
							title: '雨异',
							mine: true,
							src: 'http://img.f2e.taobao.net/img.png?x=41x41',
							content: '你发出了一条消息请求：<br/><a href="http://gatsby.taobao.com:3003/" target="_blank">http://gatsby.taobao.com:3003/</a>'
						},{
							title: '系统',
							mine: false,
							src: 'http://img.f2e.taobao.net/img.png?x=41x41',
							content: '宇山，云聪<span class="h">接受</span>了消息请求'
						},{
							title: '宇山',
							mine: false,
							src: 'http://img.f2e.taobao.net/img.png?x=41x41',
							content: '<span class="h">宇山</span>发出一条消息请求：<br/><a href="http://gatsby.taobao.com:3003/" target="_blank">http://gatsby.taobao.com:3003/</a>'
						},{
							title: '雨异',
							mine: true,
							src: 'http://img.f2e.taobao.net/img.png?x=41x41',
							content: '你<span class="d">拒绝</span>了消息请求'
						}],
						src: 'http://img.f2e.taobao.net/img.png?x=41x41',
						title: '雨异'
					}
				});
				contentbox.on('beforeHide', function(e){
					updateIframe(e.height + 60);
				});
				contentbox.on('beforeShow', function(e){
					updateIframe(e.height + 60);
				});
			}
		

			initContentbox();
			var interbox = new Interbox({
				container: wrapper,
				getHeight: function(wrapper){
					var box = wrapper.one(boxCls),
						items = box.all(itemCls),
						lastItem = items.item(items.length - 1),
						ostY = Math.ceil((lastItem.offset().top - item.offset().top) / baseHeight),
						toHeight;
					if(ostY > 1){
						toHeight = baseHeight * line + 80; 
					}else{
						toHeight = baseHeight + 80;
					}
					return toHeight;
				},
				rendered: function(el){
					var appBox = el.one(boxCls),
						items = appBox.all(itemCls);
					items.each(function(item){
						var img = item.one('img'),
							appid = img.attr('appid'),
							note = img.attr('note');
						if(appid && note){
							new Node('<div appid="' + appid + '" class="hao321-app-note"> <a href="javascript:;" >' + note + '</a> </div>').prependTo(item);
						}
						
					});
					new Toslide({el: appBox, itemCls: itemCls, line: line, baseHeight: baseHeight});
					
					S.later(function(){
						initContentbox(appBox.all('.hao321-app-note'));
					}, 1000);
				}
			});
			function updateIframe(height){
				var proxy = 'http://yuyi.taobao.com/ninja/proxy.php',
					iframe = document.getElementById('gy-cross-proxy'),
					func = {
						method: 'adaptModalHeight',
						args: [height]
					};
				iframe.src = proxy + '?t=' + S.now() + '&func=' + func.method + '&args=' + func.args.join(',');
			}
			interbox.on('beforeHide', function(e){
				updateIframe(e.height + 60);
			});
			interbox.on('beforeShow', function(e){
				updateIframe(e.height + 60);
			});
			
			S.Event.delegate(wrapper, 'click', '.hao321-app-note', function(e){
				e.halt();
			});
			
		});	
	});
	
})(KISSY);