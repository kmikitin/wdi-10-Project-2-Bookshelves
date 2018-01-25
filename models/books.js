const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
	// this information will be coming from the Google Books API
	name: String,
	books: []

})



module.exports = bookSchema;
