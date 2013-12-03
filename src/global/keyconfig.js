;(function(S, Gy){
	S.augment(Gy, {
		readyKeys: function(keyControl, customKey, context){
			var me = this,
				keys = me.keys;
			context = context || me;
			function regFunc(key, funStr, argv, cb){
				var tmp =  funStr.split('.'),
					method = obj = context[tmp[0]],
					i = 1,
					len = tmp.length;
				if(method){
					for(; i < length; i++){
						if(method[tmp[i]] === undefined){
							break;
						}
						method = method[tmp[i]];
					}
					me.regKey(key, obj, method, argv, cb);
				}
			}
			
			function replaceKey(keys){
				var newK, useAlt = keyControl.get('useAlt');
				if (keyControl.get('os')) { 
					for(var k in keys){
						newK = k.replace('ctrl', 'cmd');
						if(useAlt){
							keys[newK] = 'alt+' + keys[k];
						}else{
							keys[newK] = keys[k];
						}
						delete keys[k];
					}
				}
			}
			if(customKey){
				S.mix(keys, customKey);
			}
			replaceKey(keys);
			for(var k in keys){
				var config = keys[k],
					bind = config.bind;
				if(bind){
					regFunc(k, bind, config.argv, config.callback);
				}
			}
			me.bindKey(keyControl);
		},
		regKey: function(key, context, method, argv, cb){
			context = context || window;
			var args = Array.prototype.slice.apply(arguments, 5);
			
			this._keyControl[key] = function(){
				method.apply(context, argv);
				cb && cb.apply(context, args);
			}
		},
		bindKey: function(keyControl){
			var me = this;
			Ga.Loader(document.body, 'keydown', function(e){
				var key = keyControl.getKey(e);
				me._keyControl[key]();
			});
		},
		_keyControl: {},
		keys: {
			'ctrl+shift+x':{
				'bind': 'Object1.test1',
				'argv': null,
				'callback': function(){}
			}
		}
	});
	
})(KISSY, Gatsby)