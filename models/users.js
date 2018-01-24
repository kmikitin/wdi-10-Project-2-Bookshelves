const mongoose = require('mongoose');

const Book = require('./books.js')

const userSchema = new mongoose.Schema({
	firstName: String,
	lastName: String,
	email: String,
	location: String,
	username: {type: String, unique: true},
	password: String,
	genres: [String],
	bookshelves: Book.schema,
	bookclubs: {}

})

const User = mongoose.model('User', userSchema);

module.exports = User;