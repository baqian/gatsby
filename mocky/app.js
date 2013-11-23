var flatten = require('flatten.js').flatten;
var mockyjson = require('./mockyData.js');
var mocky = require('./lib/mocky.js');
var test = {c: {
				a: ['e', {b: 3}, "<@repeat(2)>", "dsd"],
				e: {a: "<@e(10)>", f: "dfdrg sfefee<@mail(yahoo.cn)>", g: "ade<@chinese(2)>"},
				h: "this is the url:<@url> sf<@e(2)>w,ef<@c(2)><@if(@1)>",
				i: "<@c(@)>"
			},
			"<@if(@1)>": "<@img>",
			l: {
				m: "few",
				"<@tpl(@1)>": true
			}
		};
		var a = "d"
module.exports = mocky;
var data = mocky.mock(test);
console.log(data);