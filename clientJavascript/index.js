const req  = require('superagent');
console.log('Linked')      
let isAuthorized = false;


$(document).ready(() => {

  // this is false to force users to authorize through google
   // this is the initial API request to get the bookshelf data
  const sendAuthorizedApiRequest = (requestDetails) => {
    // console.log('is this called')

  // if the user has authorized, make the call 
    if (isAuthorized) {
      // Make API request
      // gapi.client.request(requestDetails)
      const request = gapi.client.request(requestDetails)

      // console.log(request, ' this is request')
      // .execute is a method provided by Google
      request.execute(function(res) {
        // console.log(res.items.length, ' this res.items.length')
        console.log(res, ' this is res')
        // ajax call to our controller now to save the data in our db
        let bookshelves = {}
        // counter is keeping track of the for loop, to make the API call on the last time thru
        let counter = 1
        // going through the bookshelves and grabbing the titles
        for(let i = 0 ; i < res.items.length; i++) {
      	 const requestObject = {
	       'method': 'GET',
	       'path': 'https://www.googleapis.com/books/v1/mylibrary/bookshelves/' + res.items[i].id + '/volumes'
	       }
	       // this is populating our bookshelf object with the bookshelf title as the key
	       bookshelves[res.items[i].title] = []

         // this is ANOTHER api call, this one is getting the volumes on the shelves
			   const reqToVolumes = gapi.client.request(requestObject).then((response) => {

			    	const books = populateDataToSend(response.result, res.items[i].title, bookshelves)
			    	counter += 1;
			    	// console.log(counter, ' this is')
			    	if(res.items.length - 1 === counter){
			    		console.log('how was this called?', books)
			    		makeApiCallToMyserver(books)
			    	}
            // log the error if there is one
			    }, (err) => {
			    	console.log(err)
			    }) 
  	  } // end of for loop
	}) // end of request.execute
 } else {
    // run the Auth flow 
    GoogleAuth.signIn();
  }

}//end of sendAuthorizedApiRequest


// request that gets the books from the shelf (Google call them volumes)
function populateDataToSend(response, title, bookshelves){
  // create book obj
	let bookFromGoogle = {}
  // if there are books in the response data, do this:
	if(response.items){
      // create each of the book objs with JUST the data we want from Google
			for (let i = 0; i < response.items.length ; i++) {
				bookFromGoogle = {
					title: response.items[i].volumeInfo.title,
					authors: response.items[i].volumeInfo.authors,
					imageLinks: response.items[i].volumeInfo.imageLinks,
					description: response.items[i].volumeInfo.description,
					industryIdentifiers: response.items[i].volumeInfo.industryIdentifiers,
					selfLink: response.items[i].selfLink
				}
        // add the book objs to the appropriate shelves
				bookshelves[title].push(bookFromGoogle)
			}
	}
  // return the shelf
	return bookshelves;
}

// this call grabs the info from the api and through the route will save to the db
const makeApiCallToMyserver = (booksFromGoogle) => {
	// console.log(booksFromGoogle, ' what is this?')

  // this is the actual ajax call
  req.post('/user/bookshelf')
    .send(booksFromGoogle)
    .set('Accept', 'application/json')
    .withCredentials() //this sends the cookie
    .then((data) => {
      // console.log(JSON.parse(data.text))

      // parse the JSON data into something readable for the 
      const dataFromDb = JSON.parse(data.text)
      // console.log('is this api res happening?')

      // this will render the page 
      populateDataFromDb(dataFromDb)
    })
	   
}

// this call grabs the data from the db and send it to be rendered on the page using the populateData function
const makeApiCallToMyDb = () => {
  req.get('/user/bookshelf')
    .withCredentials() //this sends the cookie
    .then((data) => {
      console.log(data, ' this is data')
      const dataFromDb = JSON.parse(data.text)
      populateDataFromDb(dataFromDb)
    })

}


// write a function to do that appending for you here that you will send data to 
  const populateDataFromDb = (dataFromDb) => {
    // this dumps what's already appended on the page so that update data will always be loaded
    $('.main').empty()
    // console.log(dataFromDb.bookshelves, ' what is the length')
    // console.log('is this pop data from db function being called')

    // grab bookshelf names
    for (let i = 0; i < dataFromDb.bookshelves.length; i++) {
      // this is the shelf
      const shelf = dataFromDb.bookshelves[i]
      // console.log(shelf.name, " <-------- bookshelf name")

      // create a shelf with jQuery
      const $bookshelf = $('<div class="bookshelf"></div>')

      // put the name in an h1 with jQuery
      $bookshelf.append('<h1>' + shelf.name + '</h1>')

      // fill the shelf with books
      populateBookshelfWithBooks($bookshelf, shelf);
     
    }
  }

  // get the books for the shelf
  const populateBookshelfWithBooks = (bookshelf, shelf) => {

      // go through the array from the db and get the books
      for(let j = 0; j < shelf.books.length; j++) {
        // console.log(shelf.books[j].title)

        // create book elments with jQuery
        const $bookOnShelf = $('<img class="book-img">').attr('src', shelf.books[j].imageLinks.smallThumbnail)

          // append the books to the shelf
         $bookOnShelf.appendTo(bookshelf)
        
      }
      // append the shelf to the main element
     bookshelf.appendTo($('.main'))

  }


  // GoogleAuth is a library provided by Google, it has it's own methods
  var GoogleAuth;
  // scope is given through Google Books API
  var SCOPE = 'https://www.googleapis.com/auth/books';

  // this function MUST HAPPEN FIRST, nothing else will work until gapi.client object is initialized
  function handleClientLoad() {
    // console.log('being called')
    // Load the API's client and auth2 modules.
    // Call the initClient function after the modules load.
    gapi.load('client:auth2', initClient);
  }


  // this function initializes the gapi.client w/API key, discDocs, clientId, and scope
  function initClient() {
    // Retrieve the discovery document for version 1 of Google Books API.
    var discoveryUrl = 'https://www.googleapis.com/discovery/v1/apis/books/v1/rest';

    // Get API key and client ID from API Console.
    // Initialize the gapi.client object, which app uses to make API requests.
    // 'scope' field specifies space-delimited list of access scopes.
    gapi.client.init({
        'apiKey': 'AIzaSyDSltVcQfPnkSYy93x53V6H1XCd4ZPje7c',
        'discoveryDocs': [discoveryUrl],
        'clientId': '690685317347-j08qcmtfihjgi9r2qr352sm4fpjd0d55.apps.googleusercontent.com',
        'scope': SCOPE
    }).then(function (response) {
      // console.log('response', response)
      // this is used to make the API calls
      GoogleAuth = gapi.auth2.getAuthInstance();
      // console.log(GoogleAuth, ' this is GoogleAuth');

      // Listen for sign-in state changes.
      GoogleAuth.isSignedIn.listen(updateSigninStatus);

      // Handle initial sign-in state. (Determine if user is already signed in.)
      var user = GoogleAuth.currentUser.get();
      console.log(user, ' this is user, is my token in here')

      // call set sign in status to change 
      setSigninStatus();

      // Call handleAuthClick function when user clicks on the sync button, untested right now but the revoke acces button is no longer needed
      // this button currently toggles
      $('#google-connect').click(function() {
        handleAuthClick();
      }); 
      $('#revoke-access-button').click(function() {
        revokeAccess();
      }); 
    });
  }


  // this function starts the authorization process
  function handleAuthClick() {
    // check to see if the user is signed in -- signIn and signOut are methods of GoogleAuth
    if (GoogleAuth.isSignedIn.get()) {
      // User is authorized and has clicked 'Sign out' button.
      GoogleAuth.signOut();
    } else {
      // User is not signed in. Start Google auth flow.
      GoogleAuth.signIn();
      return 
    }
  }

  // when user wants to disconnect from google, call revoke access
  function revokeAccess() {
    GoogleAuth.disconnect();
  }

  // set the sign in status of the user (if Authorized)
  function setSigninStatus(isSignedIn) {
    // find the current user (their Google acct)
    var user = GoogleAuth.currentUser.get();

    // console.log('this is being called', user, 'setSigninStatus')

    // if the user authorized the app, they gett granted the scope for Google Books
    isAuthorized = user.hasGrantedScopes(SCOPE);

    // console.log(isAuthorized, ' this is isAuthorized')

    // if the user authorized, make a request for their bookshelves
    if (isAuthorized) {
      // console.log('inside of if is called')

      // Get the shelves from my Library
      // we need to have an object to send to the sendAuthorizedAPiRequest function
      // path is provided in the API documentation
      const request = {
	      'method': 'GET',
	      'path': 'https://www.googleapis.com/books/v1/mylibrary/bookshelves',
	      'params': {'part': 'snippet', 'mine': 'true'}
	    }

      // call the sendAuthorizedApiRequest function, pass the request object in as argument

      sendAuthorizedApiRequest(request)
      // update buttons and status if authorization was successful
      $('#google-connect').html('Disonnect from Google')
      // these buttons aren't being used anymore
      // $('#sign-in-or-out-button').html('Sign out');
      // $('#revoke-access-button').css('display', 'inline-block');
      $('#auth-status').html('You are currently signed in and have granted ' +
          'access to this app.');

    } else {
      // change buttons/status back when access (authorization) is revoked
      // $('#sign-in-or-out-button').html('Sign in using Google');
      // $('#revoke-access-button').css('display', 'none');
      $('#auth-status').html('You have not authorized this app or you are ' +
          'signed out.');
    }
  }

  // this is how we can toggle the sign in status/buttons
  function updateSigninStatus(isSignedIn) {
    setSigninStatus();
  }

    // THESE ARE CALLED WHEN THE PAGE LOADS
   handleClientLoad()
   makeApiCallToMyDb()

})
