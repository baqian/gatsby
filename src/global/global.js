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
	
	var proxy = 'http://yuyi.taobao.com/ninja/proxy.php';
	function createCrossIframe(){
		var iframe = document.createElement('iframe');
		iframe.src = proxy;
		iframe.id = 'gy-cross-proxy';
		document.body.appendChild(iframe);
		return iframe;
	}
	
	function bindCrossModal(){
		var iframe = createCrossIframe();
		var btnBox = S.one('.gy-btns'),
			closeBtn = btnBox.one('.gy-close'),
			minBtn = btnBox.one('.gy-min'),
			maxBtn = btnBox.one('.gy-max');
		
		var funs = {
			'close': {
				method: 'closeModal',
				args: []
			},
			'min': {
				method: 'minModal',
				args: []
			},
			'max': {
				method: 'maxModal',
				args: []
			}
		}
		
		function updateIframe(func){
			iframe.src = proxy + '?t=' + S.now() + '&func=' + func.method + '&args=' + func.args.join(',');
		}
		
		clseBtn.on('click', function(e){
			updateIframe(funs['close']);
		});
		minBtn.on('click', function(e){
			updateIframe(funs['min']);
		});
		maxBtn.on('click', function(e){
			updateIframe(funs['max']);
		});
	}
	
	window.globalNav = {
		init: function(){
			osStyle();
			S.ready(function(){
				bindProfileNav();
			});
		}
	}
})(KISSY);