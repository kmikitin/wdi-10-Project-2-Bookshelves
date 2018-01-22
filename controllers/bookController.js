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

// show the user information on the book they clicked on
//<!-- THIS SHOULD BE CHANGED TO A VARIABLE ROUTE ONCE WE HAVE OAUTH WORKING -->
router.get('/result/show', (req, res) => {
	res.render('books/show.ejs')
})


// EXPORT
module.exports = router;
