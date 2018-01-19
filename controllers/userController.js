const express = require('express');
const router = express.Router();

// MODEL
const User = require('../models/users.js')

// get route to show all users
// can see basic info like name and location
// should display first few books in one of their shelves -- need to decide which shelf
router.get('/', (req, res) => {
	res.send('this is where all users will be displayed')
})


// serve user form to register
router.get('/register', (req, res) => {
	res.send('get route for registration')
});

// create user in database take them to their profile page
// encrypt password here
router.post('/register', (req, res) => {
	res.send('post route for registration')
})

// serve user form to login
router. get('/login', (req, res) => {
	res.send('get route for login')
})

// check user information in database, if successful send to profile page
// if unsuccessful send invalid message to try again
// limit tries?
router.post('/login', (req, res) => {
	res.send('post route for login')
})

// show the user their profile page
// account for if they're logged in (will see edit/remove)
// if not their page should show general info without edit/remove option
router.get('/:id', (req, res) => {
	res.send('get route for individual user show page')
})

// serve user form to edit their profile
router.get('/:id/edit', (req, res) => {
	res.send('get route for user edit')
})

// update user information, send them to their profile when complete
router.put('/:id', (req, res) => {
	res.send('put route for user info update')
})

// delete the user and all their information
// SHOULD NOT DELETE BOOKS because they exist seperate from the user
router.delete('/:id', (req, res) => {
	res.send('delete route for user')
})

// EXPORT
module.exports = router;