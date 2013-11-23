#nodejs创建命令

## require
commander	path	fs

##option
<code>
-p --port <port>
-c --config <config.json>
-l --logger <default|short|tiny|dev|none>
-e --env <development>
</code>

##config
process.env.JSBIN_PORT
process.env.JSBIN_CONFIG
process.env.JSBIN_LOGGER



## run
cmd.parse(process.argv);
app = require('../lib/app.js');
app.connect();