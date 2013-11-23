var flatten = require('flatten.js').flatten;
var mockyData = require('../mockyData.js');

//todo如果<> @要保留需要/> /< /@来引用
//标记可以更换，让语法更加个性化
//完善默认的语法

var obj, c, newMockyData = {};
/**
 * {a: {
 * 	 "command": ['-a', '--array']
 * 	}
 * }
 * ==>
 * {
 *  "-a": {
 *    "name": "a",
 *    "command": ['-a', '--array']
 *  },
 *  "--array": {
 *    "name": "a",
 *    "command": ['-a', '--array']
 *  }
 * }
 */
for(var k in mockyData){
	obj = mockyData[k];
	c = obj['command'];
	obj['name'] = k;
	for(var i = c.length; i--;){
		newMockyData[c[i]] = obj;
	}
}
mockyData = newMockyData;
delete newMockyData;

var param = {
	'style': 'grid'
}

module.exports = {
	/**
	 * 运行命令
	 * @param  {[type]}   opt [description]
	 * @param  {[type]}   arg [description]
	 * @param  {Function} fn  [description]
	 * @return {[type]}       [description]
	 */
	run: function(fn, opt, arg, template, param){
		var result;
		arg = arg || '';
		result = fn(opt, arg, template, param);
		return result;
	},
	/**
	 * 造假数据
	 * 先处理数据结构的key
	 * 然后再交给parseObject处理value
	 * @param  {[type]} data [description]
	 * @return {[type]}      [description]
	 */
	mock: function(data){
		var self = this,
			origin = [],
			flattenData = flatten(data, ' ');
		for(var k in flattenData){
			var item = flattenData[k], //先把数据保存起来
				md = '', obj, arg = '';
			if(origin[0] && k.indexOf(origin[0]) > -1){
				delete flattenData[k];
				k = k.replace(origin[0], origin[1]);//把处理前的语法替换掉
			}
			md = self.matchMark(k); //可能还有语法
			if(md){
				for(var i = 0, ilen = md.length; i < ilen; i++){
					obj = self.getCommand(md[i]);
					if(obj){
						origin[0] = k;
						delete flattenData[k]; //只要发现有语法，那key就得删掉
						if(obj['argument']){ //是否需要传参考数据
							arg = k.slice(0, k.indexOf(md[i]));
							arg = arg.split(' ').pop();
							origin[1] = self.run(obj['function'], obj['option'], arg, obj['template'], obj['param']);//新得数据
							//加入语法模版，当然只针对key
							if(self.isPlainObject(origin[1])){
								var tpl = self.mock(origin[1]),
									m;
								for(var n in tpl){
									m = k.replace(arg + md[i], n);
									flattenData[m] = tpl[n];
								}
								k = '';
								origin[1] = '';
							}else{
								k = k.replace(arg + md[i], origin[1]);
							}
						}else{
							origin[1] = self.run(obj['function'], obj['option'], arg, obj['template'], obj['param']);
							//加入语法模版，当然只针对key
							if(self.isPlainObject(origin[1])){
								var tpl = self.mock(origin[1]),
									m;
								for(var n in tpl){
									m = k.replace(arg + md[i], n);
									flattenData[m] = tpl[n];
								}
								k = '';
								origin[1] = '';
							}else{
								k = k.replace(md[i], origin[1]);
							}
						}
					}
					if(k){
						flattenData[k] = item;
					}
				}
			}
		}
		//交给parseObject处理数据
		data = self.parseObject(flattenData);
		return data;
	},
	
	/**
	 * [parseObject description]
	 * @example
	 * {a: {
	 * 		b: [
	 * 			{c: [1, 2]
	 * 			},
	 * 			3
	 * 		],
	 * 		e: 'wewe'
	 *  }
	 * }
	 * @param  {[type]} flattenData [description]
	 * @return {[type]}      [description]
	 */
	parseObject: function(flattenData){
		var self = this;
		var newData = {},
			item;
		
		for(var k in flattenData){
			item = flattenData[k];
			var tmp = k.split(' '),
				len = tmp.length,
				context = newData,
				key = tmp[len-1];
			for(var i = 0; i < len - 1; i++){
				if(context[tmp[i]] === undefined){
					context[tmp[i]] = {};
					context = context[tmp[i]];
				}else{
					context = context[tmp[i]];
				}
			}
			//如果值是一个数据，通过parseArray来处理
			if(self.isArray(item)){
				context[key] = self.parseArray(item);
			}else{ //不会存在值是对象了，只能是字符串了
				var md = self.matchMark(item),
					arg = '',
					obj;
				if(md){
					for(var i = 0, ilen = md.length; i < ilen; i++){
						obj = self.getCommand(md[i]);
						if(obj){
							if(obj['argument']){
								arg = item.slice(0, item.indexOf(md[i]));
								arg = arg.split(' ').pop();
								item = item.replace(arg + md[i], self.run(obj['function'], obj['option'], arg, obj['template'], obj['param']));
							}else{
								item = item.replace(md[i], self.run(obj['function'], obj['option'], arg, obj['template'], obj['param']));
							}
						}
						context[key] = item;
					}
				}else{
					context[key] = item;
				}
								
			}
		}
		delete flattenData;
		return newData;
	},
	/**
	 * 数组和其他命令不一样，需要单独处理一下
	 * @param  {[type]} arr [description]
	 * @return {[type]}     [description]
	 */
	parseArray: function(arr){
		var self = this,
			newArr = [],
			repeat = mockyData['--repeat']['command'],//数组得命令
			preIndex;
		
			
		for(var i = 0, ilen = arr.length; i < ilen; i++){
			var item = arr[i],
				md = '',
				obj;
			if(self.isArray(item)){//元素还是数据－。－
				item = self.parseArray(item);
				arr[i] = item;
				newArr.push(item);
				continue;
			}else if(self.isPlainObject(item)){
				item = self.mock(item);
				arr[i] = item;
				newArr.push(item);
				continue;
			}
			//只剩下字符串了
			md = self.matchMark(item);
			
			if(md){
				for(var j = md.length; j--;){
					obj = self.getCommand(md[j]);
					if(obj){
						if(i === 0){
							item = '!!no argument';
							newArr.push(item);
						}else{
							preIndex = i - 1;
							var preItem = arr[preIndex];
							//默认就是obj['argument']
							var theArr = self.run(obj['function'], obj['option'], preItem, obj['template'], obj['param']);
							newArr.pop();//去掉前一个
							for(var k = theArr.length; k--;){
								newArr.push(theArr[k]);
							}
						}
					}else{
						newArr.push(item);
					}
				}
			}else{
				newArr.push(item);
			}
		}
		delete arr;
		return newArr;
	},
	getCommand: function(gram){
		var self = this, obj;
		gram = gram.slice(0, -1).slice(2);//去掉 <@ 和 > 
		var tmp = gram.split('('),
			cmd = tmp[0], 
			opt = '';
			
		if(cmd.length == 1){
			cmd = '-' + cmd;
		}else{
			cmd = '--' + cmd;
		}
		
		if(tmp[1]){
			opt = tmp[1].slice(0, -1); //去掉)
		}
		obj = mockyData[cmd];
		if(obj){
			if(opt && opt.indexOf('@') > -1){
				var templates = obj['templates'],
					template,
					index = parseInt(opt.slice(1), 10) - 1;
				if(templates){
					if(isNaN(index)){
						template = templates[parseInt(Math.random() * templates.length)];
					}else{
						template = templates[index];
					}
					if(self.isPlainObject(template)){
						for(var k in template){
							obj['param'] = param[k];
							obj['template'] = template[k];
						}
					}else{
						obj['template'] = template
					}
				}
			}
			obj['option'] = opt || obj['option'];
		}
		return obj;
	},
	/**
	 * [matchMark description]
	 * 标记是以<和>来开头和结尾，命令用@指定，配置参数用括号包围
	 * @param  {[type]} arg [description]
	 * @return {[type]}     [description]
	 */
	matchMark: function(arg){
		return arg.toString().match(/<\@[\w]+(\([\.\w\,\@]+\))?>/g);
	},
	isArray: function(obj){
		var _isArray = Array.isArray;
		if(_isArray){
			return _isArray(obj);
		}else{
			return Object.prototype.toString.call(obj) === "[object Array]";			
		}
	},
	isPlainObject: function(obj){
		function hasOwnProperty(o, p) {
        return Object.prototype.hasOwnProperty.call(o, p);
	    }
		if (!obj || Object.prototype.toString.call(obj) !== "[object Object]" || obj.nodeType || obj.window == obj) {
            return false;
        }
        try {
            // Not own constructor property must be Object
            if (obj.constructor &&
                !hasOwnProperty(obj, "constructor") &&
                !hasOwnProperty(obj.constructor.prototype, "isPrototypeOf")) {
                    return false;
           		 }
            } catch (e) {
                // IE8,9 Will throw exceptions on certain host objects #9897
                return false;
            }	
        var key;
        for (key in obj) {
        }
        return key === undefined || hasOwnProperty(obj, key);
	}
}
