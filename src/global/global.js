;(function(S){
	
	function osStyle(){
		var os = S.UA.os;
		
		if(os){
			document.body.className = 'gy-os';
		}
	}	
	
	function showModal(box, target){
		var cls = target.attr('_modal');
		var modal = box.one(cls);
		modal.show();
		return modal;
	}
	function hideModal(box, target){
		var cls = target.attr('_modal');
		box.one(cls).hide();
	}
	
	function bindProfileNav(){
		var box = S.one('.gy-profile'),
			btnBox = box.one('.gy-profile-btns'),
			selectCls = 'selected',
			aitem,
			amodal;
		btnBox.delegate('click', 'a', function(e){
			var target = S.one(e.currentTarget),
				item = target.parent();
			if(item.hasClass(selectCls)){
				aitem = null;
				amodal = null;
				item.removeClass(selectCls);
				hideModal(box, target);
			}else{
				aitem && aitem.removeClass(selectCls);
				amodal && amodal.hide();
				aitem = item;
				amodal = showModal(box, target);
				item.addClass(selectCls);
			}
		});
	}
	
		
	function createCrossIframe(){
		var iframe = document.createElement('iframe');
		updateIframe(iframe, funs['adaptHeight']);
		iframe.id = 'gy-cross-proxy';
		document.body.appendChild(iframe);
		return iframe;
	}
	function updateIframe(iframe, func){
		iframe.src = proxy + '?t=' + S.now() + '&func=' + func.method + '&args=' + func.args.join(',');
	}
	
	function bindCrossModal(){
		var iframe = createCrossIframe();
		var btnBox = S.one('.gy-btns'),
			closeBtn = btnBox.one('.gy-close'),
			minBtn = btnBox.one('.gy-min'),
			maxBtn = btnBox.one('.gy-max'),
			openBtn = S.one('.gy-open'),
			container = S.one('.gy-container');
		var activeCls = 'active';
		
		openBtn.appendTo(S.one('body'));
		openBtn.on('click', function(e){
			updateIframe(iframe, funs['adaptHeight']);
			container.show();
			openBtn.hide();
		})
		closeBtn.on('click', function(e){
			container.hide();
			openBtn.show();
			updateIframe(iframe, funs['close']);
		});
		minBtn.on('click', function(e){
			if(minBtn.hasClass(activeCls)){
				minBtn.removeClass(activeCls)
				updateIframe(iframe, funs['adaptHeight']);
			}else{
				minBtn.addClass(activeCls)
				updateIframe(iframe, funs['min']);
			}
		});
		maxBtn.on('click', function(e){
			if(minBtn.hasClass(activeCls)){
				minBtn.removeClass(activeCls)
				updateIframe(iframe, funs['adaptHeight']);
			}else{
				minBtn.addClass(activeCls)
				updateIframe(iframe, funs['max']);
			}
		});
	}
	
	window.globalNav = {
		init: function(){
			osStyle();
			S.ready(function(){
				proxy = 'http://yuyi.taobao.com/ninja/proxy.php';
				funs = {
						'adaptHeight': {
							method: 'adaptModalHeight',
							args: [S.one('body').height()]
						},
						'close': {
							method: 'closeModal',
							args: [30]
						},
						'min': {
							method: 'minModal',
							args: [30]
						},
						'max': {
							method: 'maxModal',
							args: [600]
						}
					}
				bindProfileNav();
				bindCrossModal();
			});
		}
	}
})(KISSY);