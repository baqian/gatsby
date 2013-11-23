module.exports = {
	"english": {
		"command": ["-e", "--english"],
		"option": "",
		"function": function(opt, arg){
			var list = ["a", "b", "c", "d", "e", "f", "g", 
			"h", "i", "j", "k", "l", "m", "n", 
			"o", "p", "q", "r", "s", "t", 
			"u", "v", "w", "x", "y", "z"],
			len = list.length;
			
			
			var opts = opt.split(","),
				count = parseInt(opts[0], 10),
				rand,
				result = "";
			if(count){
				for(var i = count; i--;){
					rand = parseInt(Math.random() * len);
					result += list[rand];
				}
			}
			if(opts.length > 1){
				switch(opts[1]){
					case "up": result = result.toUpperCase(); break;
					case "low": result = result.toLowerCase(); break;
					default: break;
				}
			}
			return result;
		},
		"description": "hello world"
	},
	"chinese": {
		"command": ["-c", "--chinese"],
		"option": "",
		"function": function(opt, arg, template, param){
			if(template){
				return template;
			}
			var count = parseInt(opt, 10),
				result = "";
			for(var i = count; i--;){
				result += "\\u" + (Math.round(Math.random() * 20901) + 19968).toString(16);
			}
			return result;
		},
		"templates": [
			"俺是个纯爷们",
			"这让你牛逼毁了"
		],
		"description": "hello world"
	},
	"word": {
		"command": ["-w", "--word"],
		"option": "",
		"function": function(opt, arg){
			return "hello";
		},
		"description": "hello world"
	},
	"int": {
		"command": ["-i", "--int", "-/\\d+/"],
		"option": "",
		"function": function(opt, arg){
			var list = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
				len = list.length,
				count = parseInt(opt),
				nev = false,
				rand,
				result = 0;
			if(count < 0){
				count = Math.abs(count);
				nev = true;
			}
			
			for(var i = count - 1; i--;){
				rand = parseInt(Math.random() * len);
				result += list[rand] * i * 10;
			}
			rand = parseInt(Math.random() * (len - 1) + 1);
			result += list[rand] * (count - 1) * 10;
			if(nev){
				result = - result;
			}
			return result;
		},
		"description": "hello world"
	},
	"float": {
		"command": ["-f", "--float", "-/\\d+(\\.\\d*)*/"],
		"option": "",
		"function": function(opt, arg){
			var list = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
				len = list.length,
				tmp = opt.split("."),
				count = parseInt(tmp[0], 10),
				nev = false;
				dec_count = tmp[1].length,
				rand,
				result = 0;
				
			if(count < 0){
				count = Math.abs(count);
				nev = true;
			}	
			for(var i = count - 1; i--;){
				rand = parseInt(Math.random() * len);
				result += list[rand] * i * 10;
			}
			rand = parseInt(Math.random() * (len - 1) + 1);
			result += list[rand] * (count - 1) * 10;
			
			if(dec_count) result += '.';
			for(var i = dec_count; i--;){
				rand = parseInt(Math.random() * len);
				result += rand;
			}
			if(nev){
				result = - result;
			}
			result = parseFloat(result);
			return result; 
		},
		"description": "hello world"
	},
	"mail": {
		"command": ["-m", "--mail"],
		"option": "",
		"function": function(opt, arg){
			var list = ["a", "b", "c", "d", "e", "f", "g", 
				"h", "i", "j", "k", "l", "m", "n", 
				"o", "p", "q", "r", "s", "t", 
				"u", "v", "w", "x", "y", "z", "_"],
				maillist = ["yahoo", "baidu", "taobao", "163", "sina", "gmail"],
				mailLen = maillist.length,
				len = list.length;
			
			var count = parseInt(Math.random() * 12),
				tmp = opt.split("."),
				mail = tmp[0],
				tail = tmp[1],
				result = "";
			for(var i = count; i--;){
				rand = parseInt(Math.random() * len);
				result += list[rand];
			}
			
			rand = parseInt(Math.random() * (len - 1));
			result = list[rand] + result;
			if(mail){
				result += "@" + mail;
			}else{
				rand = parseInt(Math.random() * mailLen);
				result = result + "@" + maillist[rand];
			}
			if(tail){
				result += '.' + tail
			}else{
				result += '.com';
			}
			
			return result;
		},
		"description": "hello world"
	},
	"url": {
		"command": ["-u", "--url"],
		"option": "",
		"function": function(opt, arg){
			return "http://s.taobao.com";
		},
		"description": "hello world"
	},
	"img": {
		"command": ["--img", "--image"],
		"option": "http://img.f2e.taobao.net/img.png",
		"function": function(opt, arg){
			return opt;
		},
		"description": "hello world"
	},
	"date": {
		"command": ["-d", "--date"],
		"option": ["YY-MM-DD", "hh:mm:ss"],
		"function": function(opt, arg){
			return "89-11-02";
		},
		"description": "hello world"
	},
	"boolean": {
		"command": ["-b", "--boolean"],
		"option": "",
		"function": function(opt, arg){
			return true;
		},
		"description": "hello world"
	},
	"repeat": {
		"command": ["-r", "--repeat"],
		"option": "",
		"argument": true,
		"function": function(opt, arg){
			if(!arg) return false;
			var count = parseInt(opt, 10),
				result = [arg];
			for(var i = count; i--;){
				result.push(arg);
			}
			return result;
		},
		"description": "hello world"
	},
	"choose": {
		"command": ["--choose"],
		"option": "",
		"argument": true,
		"function": function(opt, arg){
			if(!arg) return false;
			var fb = new Function(arg),
				tmp = opt.split(","),
				result;
			if(fb() && tmp[1]){
				result = tmp[1];
			}else{
				result = tmp[0];
			}
			return result;
		},
		"description": "hello world"
	},
	"condition": {
		"command": ["--if"],
		"option": "",
		"argument": true,
		"function": function(opt, arg, template, param){
			if(!arg) return '';
			var tmp = arg.split(",");
			var fn = new Function("var fn = " + template + "; return fn();"),
				result = tmp[0];
			if(fn(param)){
				result = tmp[0];
			}else{
				result = tmp[1];
			}
			return result;
		},
		"templates": [
			{"style": "function(style){if(style == \"grid\"){return true;}else{return false;}}"}
		],
		"description": "hello world"
	},
	"template": {
		"command": ["--tpl", "--template"],
		"option": "",
		"function": function(opt, arg, template, param){
			if(template){
				return template;
			}
		},
		"templates":[
			{
				"item": {
					"name1": "<@chinese(@)>",
					",name2<@if(@1)>": "hello world!"
				}
			}
		]
	}
}