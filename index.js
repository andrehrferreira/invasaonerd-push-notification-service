const config = require('./config')
const sub = require("redis").createClient(config.redis)
const mongodb = require("mongodb")
const App = require('./app')
var OneSignal = require('onesignal-node')

try {
	new App({ OneSignal, config, sub, mongodb }).init()
} catch (err) {
	console.log(err)
}
