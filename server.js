// NODES
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');

// DATABASE
require('./db/db.js')


// MIDDLEWARE
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(session({
	secret: 'Secret string',
	resave: false,
	saveUninitialized: false
}))
app.use(express.static('public'));



// 404
app.get('*', () => {
	res.status(404).send(404, 'page not found')
})


// LISTENER
app.listen(3000, () => {
	console.log('Server is litening on port 3000')
});