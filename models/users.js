const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	firstName: String,
	lastName: String,
	email: String,
	location: String,
	username: {type: String, unique: true},
	password: String,
	genres: [String],
	bookshelves: {},
	bookclubs: {}

})

const User = mongoose.model('User', userSchema);

module.exports = User;