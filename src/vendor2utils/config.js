KISSY.config({
	conbine: false,
	debug: true,
	packages:[{
		name: "eventsource",
		path: "./src",
		charset: "utf-8"
	}],
	modules: {
		"vendor/eventsource": './src/eventsource/eventsource.js'
	}
})