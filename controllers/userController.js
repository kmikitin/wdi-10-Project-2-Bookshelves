const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

// MODEL
const User = require('../models/users.js');
const Book = require('../models/books.js')

// get route to show all users
// can see basic info like name and location
// should display first few books in one of their shelves -- need to decide which shelf
router.get('/', (req, res) => {

	res.render('users/index.ejs')

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
router.get('/login', (req, res) => {
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
				// console.log(req.body)
				// console.log(foundUser._id)
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

// logout user
router.get('/logout', (req, res) => {
	req.session.destory((err) => {
		if (err) console.log(err)
			res.redirect('/user/login')
	})
})

// post route for google api info
router.post('/bookshelf', (req, res) => {
	console.log(req.session.username)
	console.log(typeof req.body, typeof req.body,req.body)
	// const data = JSON.parse(req.body);
	console.log(req.body.Favorites)
	// how can You identify who the user is? sesssssssss
	// req.session ---something

	res.send('completed')
})

// show the user their profile page
// account for if they're logged in (will see edit/remove)
// if not their page should show general info without edit/remove option
router.get('/:id', (req, res) => {
	User.findById(req.params.id, (err, foundUser) => {
		if (err) console.log(err)
			// console.log(foundUser)
			res.render('users/profile.ejs', { user: foundUser })
	})
})

// serve user form to edit their profile
router.get('/:id/edit', (req, res) => {
	User.findById(req.params.id, (err, foundUser) => {
		if(err) console.log(err)
			res.render('users/edit.ejs', { user: foundUser })
	})
})

// update user information, send them to their profile when complete
router.put('/:id', (req, res) => {
	User.findByIdAndUpdate(req.params.id, req.body, (err, updatedUser) => {
		if(err) console.log(err)
			res.redirect('/user/' + updatedUser._id)
	})
})

// delete the user and all their information
// SHOULD NOT DELETE BOOKS because they exist seperate from the user
router.delete('/:id', (req, res) => {
	User.findByIdAndRemove(req.params.id, (err, deletedUser) => {
		console.log(deletedUser)
		const bookIds = []
		for(let i = 0; i < deletedUser.bookshelves.length; i++){
			bookIds.push(deletedUser.bookshelves[i]._id);
		}
		Book.remove({_id: { $in: bookIds }}, (err, data) => {
			if(err) console.log(err)
				console.log(data)
			res.redirect('/')
		})
	})
})

// EXPORT
module.exports = router;
