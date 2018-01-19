const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
	firstName: String,
	lastName: String,
	email: String,
	location: String,
	username: String,
	password: String,
	genres: [String],
	bookshelves: {}

})

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
