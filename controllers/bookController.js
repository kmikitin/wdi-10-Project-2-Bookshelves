const express = require('express');
const router = express.Router();

// MODEL
const Book = require('../models/books.js')

// serve the user the search page for books
router.get('/', (req, res) => {
	res.send('search.ejs')
})


// EXPORT
module.exports = router;
