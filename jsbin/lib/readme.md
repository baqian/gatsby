# 入口和核心模块

## app.js
###requires
nodemailer	express	flattern.js 	path	url
/hogan	/config	/spike	/store	/routes	/handlers	/middelware	/metrics

###extends
store	mailer

###config
app.PRODUCTION
app.DEVELOPMENT
process.env.NODE_DEV
process.env.TZ
process.env.PORT

options.port
options.url
options.url.prefix
options.url.static

###app.set
root
version
view engine
views
url prefix
url full
basePath
###app.locals
version

###app.use
express.logger(logger)
mount
middleware.limitContentLength
express.cookieParser(app.set('session secret'))
express.cookieSession
express.urlencode()
express.json()
middlewave.crsf({ignore: ['/']})
middlewave.subdomain(app)
middlewave.ajax
middlewave.cors
middlewave.jsonp
middlewave.flash
