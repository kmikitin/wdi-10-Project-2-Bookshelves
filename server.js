const port = process.env.PORT

// NODES
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');

// DOTENV
require('dotenv').config()


// DATABASE
require('./db/db.js')

// MIDDLEWARE
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(methodOverride('_method'));
app.use(session({
	secret: 'Secret string',
	resave: false,
	saveUninitialized: false
}))
app.use(express.static('public'));


// CONTROLLERS
const UserController = require('./controllers/userController');
app.use('/user', UserController);

const BookController = require('./controllers/bookController');
app.use('/book', BookController);


// HOME
app.get('/', (req, res) => {
	res.render('home.ejs', {message: req.session.message})
})


// 404
app.get('*', (req,res) => {
	res.status(404).send(404, 'page not found')
})


// LISTENER
app.listen(port, () => {
	console.log('Server is litening on port:' + port)
});
