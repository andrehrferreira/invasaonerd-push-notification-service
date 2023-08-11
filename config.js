/**
 * Settings
 * @author André Ferreira <andre@invasaonerd.com.br>
 */

"use strict";

let mode = process.env.NODE_ENV || "dev";

module.exports = {
	dev: {
		production: false,
		mongodb: {
			url: "mongodb://127.0.0.1:27017/skynet",
			database: "skynet"
		},
		redis: {
			host: "127.0.0.1",
			port: 6379
		},
		appId: ''
	},
	stg: {
		production: false,
		mongodb: {
			url: "mongodb://10.136.162.95:27017/skynetStaging",
			database: "skynetStaging"
		},
		redis: {
			port: 6301,
			host: '10.136.109.59',
			family: 4,
			db: 0
		},
		appId: ''
	},
	prod: {
		production: true,
		mongodb: {
			url: "mongodb://10.136.162.95:27017/skynet",
			database: "skynet"
		},
		redis: {
			port: 6300,
			host: '10.136.109.59',
			family: 4,
			db: 0
		},
		appId: ''
	}
}[mode];
