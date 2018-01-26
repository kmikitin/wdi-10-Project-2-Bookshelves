const mongoose = require('mongoose');

mongoose.connect(process.env.DB_HOST)

mongoose.connection.on('connected', () => {
	console.log('MongoDB is connected')
})

mongoose.connection.on('disconnected', () => {
	console.log('MongoDB is disconnected')
})

mongoose.connection.on('error', (error) => {
	console.log('There was an error in the connection:', error)
})