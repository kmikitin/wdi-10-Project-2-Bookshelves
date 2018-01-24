const req  = require('superagent');
console.log('Linked')      



$(document).ready(() => {
  handleClientLoad()
  console.log('something happened pleasessdssss')


// console.log(gapi, ' is this global')
let isAuthorized = false;

  const sendAuthorizedApiRequest = (requestDetails) => {
    // console.log('is this called')
  if (isAuthorized) {
    // Make API request
    // console.log('is this magically called when authorized')
    // gapi.client.request(requestDetails)
    const request = gapi.client.request(requestDetails)

    console.log(request, ' this is request')
    request.execute(function(res) {
      console.log(res.items.length, ' this res.items.length')

   // ajax call to our controller now to save the data in our db

      let bookshelves = {}
      let counter = 1
      for(let i = 0 ; i < res.items.length; i++) {

      	const requestObject = {
	      'method': 'GET',
	      'path': 'https://www.googleapis.com/books/v1/mylibrary/bookshelves/' + res.items[i].id + '/volumes'
	    }
	    // this is populating our bookshelf object with the bookshelf title as the key

	    bookshelves[res.items[i].title] = []

	 


			    const reqToVolumes = gapi.client.request(requestObject).then((response) => {
			    	const books = populateDataToSend(response.result, res.items[i].title, bookshelves)
			    	counter += 1;
			    	console.log(counter, ' this is')
			    	if(res.items.length - 1 === counter){
			    		console.log('how was this called?', books)
			    		makeApiCallToMyserver(books)
			    	}
			    	


			    }, (err) => {
			    	console.log(err)
			    }) 
  	  } // end of for loop
	}) // end of request.execute
 } else {
    GoogleAuth.signIn();
  }

}



function populateDataToSend(response, title, bookshelves){

	let bookFromGoogle = {}
	if(response.items){

			for (let i = 0; i < response.items.length ; i++) {
				bookFromGoogle = {
					title: response.items[i].volumeInfo.title,
					authors: response.items[i].volumeInfo.authors,
					imageLinks: response.items[i].volumeInfo.imageLinks,
					description: response.items[i].volumeInfo.description,
					industryIdentifiers: response.items[i].volumeInfo.industryIdentifiers,
					selfLink: response.items[i].selfLink
				
				}
				bookshelves[title].push(bookFromGoogle)

			}


	}


	return bookshelves;
}



const makeApiCallToMyserver = (booksFromGoogle) => {
	console.log(booksFromGoogle, ' what is this?')
	


  req.post('/user/bookshelf')
    .send(booksFromGoogle)
    .set('Accept', 'application/json')
    .then((data) => {
      console.log(data)
    })



		// $.ajax({
  // 			url: '/user/bookshelf',
  // 			type: 'Post',
  // 			data: booksFromGoogle,
  // 			dataType: 'json',
  // 			processData: false,
  // 			success: (data) => {
  // 				console.log(data)
  // 			},
  // 			error: (err) => {
  // 				console.log(err)
  // 			}
  // 		}) 
	   
}













  var GoogleAuth;
  var SCOPE = 'https://www.googleapis.com/auth/books';
  function handleClientLoad() {
    console.log('being called')
    // Load the API's client and auth2 modules.
    // Call the initClient function after the modules load.
    gapi.load('client:auth2', initClient);
  }

  function initClient() {
    // Retrieve the discovery document for version 1 of Google Books API.
    // In practice, your app can retrieve one or more discovery documents.
    var discoveryUrl = 'https://www.googleapis.com/discovery/v1/apis/books/v1/rest';

    // Initialize the gapi.client object, which app uses to make API requests.
    // Get API key and client ID from API Console.
    // 'scope' field specifies space-delimited list of access scopes.
    gapi.client.init({
        'apiKey': 'AIzaSyDSltVcQfPnkSYy93x53V6H1XCd4ZPje7c',
        'discoveryDocs': [discoveryUrl],
        'clientId': '690685317347-j08qcmtfihjgi9r2qr352sm4fpjd0d55.apps.googleusercontent.com',
        'scope': SCOPE
    }).then(function () {
      GoogleAuth = gapi.auth2.getAuthInstance();

      // Listen for sign-in state changes.
      GoogleAuth.isSignedIn.listen(updateSigninStatus);

      // Handle initial sign-in state. (Determine if user is already signed in.)
      var user = GoogleAuth.currentUser.get();
      console.log(user, ' this is user, is my token in here')
      // if(user != null ){
      //         $.ajax({
      //   url:'https://www.googleapis.com/books/v1/mylibrary/bookshelves?key=' + user.Zi.access_token,
      //   type: 'GET',
      //   dataType: 'JSON',
      //   success: (data) => {
      //     console.log(data, ' this is data')
      //   }, 
      //   error: (err) => {
      //     console.log(err)
      //   }
      // })
      // }

      setSigninStatus();

      // Call handleAuthClick function when user clicks on
      //      "Sign In/Authorize" button.
      $('#sign-in-or-out-button').click(function() {
        handleAuthClick();
      }); 
      $('#revoke-access-button').click(function() {
        revokeAccess();
      }); 
    });
  }

  function handleAuthClick() {
    if (GoogleAuth.isSignedIn.get()) {
      // User is authorized and has clicked 'Sign out' button.
      GoogleAuth.signOut();
    } else {
      // User is not signed in. Start Google auth flow.
      GoogleAuth.signIn();
    }
  }

  function revokeAccess() {
    GoogleAuth.disconnect();
  }

  function setSigninStatus(isSignedIn) {
    var user = GoogleAuth.currentUser.get();
    isAuthorized = user.hasGrantedScopes(SCOPE);
    console.log(isAuthorized, ' this is isAuthorized')
    if (isAuthorized) {
      console.log('inside of if is called')

      // Get my Library
      // we need to have an object to send to the sendAUthorizedAPiRequest function
      const request = {
	      'method': 'GET',
	      'path': 'https://www.googleapis.com/books/v1/mylibrary/bookshelves',
	      'params': {'part': 'snippet', 'mine': 'true'}
	    }

      sendAuthorizedApiRequest(request)
      $('#sign-in-or-out-button').html('Sign out');
      $('#revoke-access-button').css('display', 'inline-block');
      $('#auth-status').html('You are currently signed in and have granted ' +
          'access to this app.');
    } else {
      $('#sign-in-or-out-button').html('Sign in using Google');
      $('#revoke-access-button').css('display', 'none');
      $('#auth-status').html('You have not authorized this app or you are ' +
          'signed out.');
    }
  }

  function updateSigninStatus(isSignedIn) {
    setSigninStatus();
  }

})