const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
	// this information will be coming from the Google Books API

})

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
