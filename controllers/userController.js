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
router.post('/register', (req, res) => {
	console.log('are we hitting this router, the register route')
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
		bookshelves: [],
		bookclubs: {}
	};

	User.create(userDbEntry, (err, newUser) => {
		// console.log(req.session, 'in the post route')
		req.session.username = req.body.username;
		req.session.logged = true;
		res.redirect('/user/' + newUser._id)
	})
	
})

// post route for google api info
router.post('/bookshelf', (req, res) => {
	// console.log(req.session)
	// console.log(req.session.username)
	// console.log(req.body)
	// console.log(Object.keys(req.body))
	User.findOne({ username: req.session.username }, (err, foundUser) => {
		if (err) console.log (err)
			// console.log(foundUser)
			if(foundUser.bookshelves.length === 0){
				for(let i = 0; i < Object.keys(req.body).length; i++) {
					const pleaseBeBooks = req.body[Object.keys(req.body)[i]]
					const shelfName = Object.keys(req.body)[i]
					const bookObj = {
						name: shelfName,
						username: req.session.username,
						books: pleaseBeBooks
					}
						// console.log(bookObj.books)
						// console.log(pleaseBeBooks)
						foundUser.bookshelves.push(bookObj)
				}	
					// foundUser.bookshelves.push(bookArray);
					foundUser.save((err, updatedUser)=> {
						res.send(updatedUser)
					})

		} else {
			// write some code that find the matching, I think u can use $in
		}
		
	})

})

// this route gets the bookshelf data from the db and populates it on user profile page
router.get('/bookshelf', (req, res) => {
	User.findOne({ username: req.session.username }, (err, foundUser) => {
		// this isn't sending to browser, it's sending response to ajax call in index.js
		res.send(foundUser)
	})
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
				// console.log('hitting foundUser in login should redirect ot user/id')
				// console.log(foundUser._id)
				res.redirect('/user/' + foundUser._id)
			} else {
				req.session.message = "Username or password incorrect";
				res.redirect('/');
			}
		} else {
			req.session.message = "Username or password incorrect";
			res.redirect('/');
		}
	})
})

// logout user
router.get('/logout', (req, res) => {
	// console.log('hit logout route')
	req.session.destroy((err) => {
		if (err) console.log(err)
		res.redirect('/')
	})
			
})



// show the user their profile page
// account for if they're logged in (will see edit/remove)
// if not their page should show general info without edit/remove option -- this is if someone else looks them up
router.get('/:id', (req, res) => {
	console.log('hitting id route')
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
