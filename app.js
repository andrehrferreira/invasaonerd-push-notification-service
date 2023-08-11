module.exports = class App {
	constructor ({ OneSignal, config, sub, mongodb }) {
		this.config = config
		this.sub = sub
		this.MongoClient = mongodb.MongoClient
		this.ObjectID = mongodb.ObjectID
		this.OneSignal = OneSignal
	}

	async init () {
		const app = this
		const { appId } = app.config

		app.mongodb = await this.connectMongodb(app.MongoClient, app.config)
		app.oneSignalClient = new app.OneSignal.Client({
			app: {
				appAuthKey: '',
				appId
			}
		}) 
		
		app.sub.on("message", async function (channel, message) {
			
			if(channel == "sendPush"){
					
				const { userId, pageId, notification } = JSON.parse(message)

				notification.devices = await app.getDevices({ pageId, userId })

				if (notification.devices.length) {
					const { devices, title, subtitle, url } = notification
					app.sendNotification(devices, title, subtitle, url)
				}
			}
		})
		app.sub.subscribe("sendPush")
	}

	connectMongodb (MongoClient, { mongodb }) {
		return new Promise((resolve, reject) => {
			MongoClient.connect(mongodb.url, { useNewUrlParser: true }, (err, client) => {
				if (err) {
					console.error("MongoDB", "Error to start: " + err)
					reject(err)
				}
				else console.log("MongoDB", "Connection on " + mongodb.url)
				resolve(client.db(mongodb.database))
			})
		})
	}

	sendNotification (devices, title, subtitle, url) {
		const { OneSignal, oneSignalClient } = this
    var Notification = new OneSignal.Notification({
			contents: {
				en: subtitle
			},
			headings:{"en": title},
			include_player_ids: devices,
			url
    })
    oneSignalClient.sendNotification(Notification)
	}

	async getDevices ({ pageId, userId }) {
		const app = this
		var result = []
		const userCollection = app.mongodb.collection('users')
		try {
			if (pageId) {

				const users = await userCollection.find({
					pages: { $eq: pageId }
				})
				.project({ devices: 1 })
				.toArray()

				result = users.reduce((acc, { devices }) => {
					if (devices.length) return [ ...acc, ...devices ]
					return acc
				}, [])

			} else {

				const user = await userCollection.findOne({
					_id: app.ObjectID(userId)
				})
				result = user.devices || []

			}

		} catch (err) {
			console.log(err)
			result = []
		}
		return result
	}
}