const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

// MODEL
const User = require('../models/users.js')

// get route to show all users
// can see basic info like name and location
// should display first few books in one of their shelves -- need to decide which shelf
router.get('/', (req, res) => {
	res.render('users/profile.ejs')
})


// serve user form to register
router.get('/register', (req, res) => {
	res.render('users/register.ejs')
});

// create user in database take them to their profile page
// encrypt password here
router.post('/', (req, res) => {
	const password = req.body.password;
	const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

	const userDbEntry = {
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email,
		location: req.body.location,
		username: req.body.username,
		password: passwordHash,
		genres: [],
		bookshelves: {},
		bookclubs: {}
	};

	User.create(userDbEntry, (err, newUser) => {
		console.log(newUser, 'this is the new user')
		console.log(req.session, 'in the post route')
		req.session.username = req.body.username;
		req.session.logged = true;
	})
	res.redirect('/user/' + newUser._id)
})


// serve user form to login
router. get('/login', (req, res) => {
	res.render('users/login.ejs', { message: req.session.message })
})

// check user information in database, if successful send to profile page
// if unsuccessful send invalid message to try again
// limit tries?
router.post('/login', (req, res) => {
	User.findOne({username: req.body.username}, (err, foundUser) => {
		if(foundUser) {
			if (bcrypt.compareSync(req.body.password, foundUser.password)) {
				req.session.username = req.body.username;
				req.session.logged = true;
				req.session.message = '';
				console.log(req.body)
				console.log(foundUser._id)
				res.redirect('/user/' + foundUser._id)
			} else {
				req.session.message = "Username or password incorrect";
				res.redirect('/user/login');
			}
		} else {
			req.session.message = "Username or password incorrect";
			res.redirect('/user/login');
		}
	})
})

// show the user their profile page
// account for if they're logged in (will see edit/remove)
// if not their page should show general info without edit/remove option
router.get('/:id', (req, res) => {
	User.findById(req.params.id, (err, foundUser) => {
		if (err) console.log(err)
			console.log(foundUser)
			res.render('users/profile.ejs', { user: foundUser })
	})
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
