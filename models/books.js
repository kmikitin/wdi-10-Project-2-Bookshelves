const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
	// this information will be coming from the Google Books API
	name: String,
	username: String,
	books: []

})

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
