const express = require('express');
const router = express.Router();

// MODEL
const Book = require('../models/books.js')

// serve the user the search page for books
router.get('/', (req, res) => {
	res.render('books/search.ejs')
})

// show the user the result of their search
router.get('/result', (req, res) => {
	res.render('books/result.ejs')
})


// EXPORT
module.exports = router;
