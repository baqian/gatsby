KISSY.config({
	conbine: true,
	debug: true,
	packages:[{
		name: "vendor2utils",
		path: "/vendor2utils",
		charset: "utf-8"
	}],
	modules: {
		"vendor/eventsource": {fullpath: "/vendor2utils/eventsource/eventsource.js"},
		"vendor/embed": {fullpath: "/vendor2utils/embed/embed.js"},
		"vendor/json2": {fullpath: "/vendor2utils/modules/json2.js"},
		"vendor/jade": {fullpath: "/vendor2utils/modules/jade.js"},
		"vendor/markdown": {fullpath: "/vendor2utils/modules/markdown.js"},
		"vendor/stylus": {fullpath: "/vendor2utils/modules/stylus.js"},
		"vendor/traceur": {fullpath: "/vendor2utils/modules/traceur.js"},
		"vendor/less": {fullpath: "/vendor2utils/modules/less-1.3.0.min.js"},
		"vendor/coffee-script": {fullpath: "/vendor2utils/modules/coffee-script.js"},
		"vendor/typescript": {fullpath: "/vendor2utils/modules/typescript.min.js"},
		"vendor/processing": {fullpath: "/vendor2utils/modules/processing.min.js"},
		"vendor/polyfills": {fullpath: "/vendor2utils/modules/polyfills.js"},
		"vendor/pretty-date": {fullpath: "/vendor2utils/modules/pretty-date.js"},
		"vendor/prettyprint": {fullpath: "/vendor2utils/modules/prettyprint.js"},
		"vendor/stacktrace": {fullpath: "/vendor2utils/modules/stacktrace.js"},
		"vendor/jshint": {fullpath: "/vendor2utils/modules/jshint/jshint.js"}
	}
});