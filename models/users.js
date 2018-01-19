const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	firstName: String,
	lastName: String,
	email: String,
	location: String,
	username: String,
	password: String,
	genres: [String],
	bookshelves: {}

})

const User = mongoose.model('User', userSchema);

module.exports = User;