console.log('Linked')      

// RUN EXPRESS SERVER TO DO THIS
let GoogleAuth; //Google Auth obj
let isAuthorized; // boolean variable to indicate if the user is already signed in
let currentApiRequest; // object that stores data about the latest api request the user attempted
let authorizeButton = document.getElementById('authorize-button');
let signoutButton = document.getElementById('signout-button');



$.ajax({
	url:'https://www.googleapis.com/books/v1/mylibrary/bookshelves?key=AIzaSyDSltVcQfPnkSYy93x53V6H1XCd4ZPje7c',
	type: 'GET',
	dataType: 'JSON',
	success: (data) => {
		console.log(data, ' this is data')
	}, 
	error: (err) => {
		console.log(err)
	}
})

/**
 * Store the request details. Then check to determine whether the user
 * has authorized the application.
 *   - If the user has granted access, make the API request.
 *   - If the user has not granted access, initiate the sign-in flow.
 */
const sendAuthorizedApiRequest = (requestDetails) => {
  currentApiRequest = requestDetails;
  if (isAuthorized) {
    // Make API request
    // gapi.client.request(requestDetails)

    // Reset currentApiRequest variable.
    currentApiRequest = {};
  } else {
    GoogleAuth.signIn();
  }
}


function setSigninStatus(isSignedIn) {
    var user = GoogleAuth.currentUser.get();
    var isAuthorized = user.hasGrantedScopes(SCOPE);
    if (isAuthorized) {
      	authorizeButton.style.display = 'none';
    	signoutButton.style.display = 'block';
    } else {
      	authorizeButton.style.display = 'block';
    	signoutButton.style.display = 'none';
    }
  }


/**
 * Listener called when user completes auth flow. If the currentApiRequest variable is set, then the user was prompted to authorize the application before the request executed. In that case, proceed with that API request.
 */
const updateSigninStatus = (isSignedIn) => {
  if (isSignedIn) {
    isAuthorized = true;
    authorizeButton.style.display = 'none';
    signoutButton.style.display = 'block';
    if (currentApiRequest) {
      sendAuthorizedApiRequest(currentApiRequest);
    }
  } else {
    	isAuthorized = false;
    	authorizeButton.style.display = 'block';
    	signoutButton.style.display = 'none';
  }
}

// sign in/sign out
const handleAuthClick = () => {
        if (GoogleAuth.isSignedIn.get()) {
      		// User is authorized and has clicked 'Sign out' button.
      		GoogleAuth.signOut();
    	} else {
      		// User is not signed in. Start Google auth flow.
      		GoogleAuth.signIn();
    }
}

const revokeAccess = () => {
        GoogleAuth.disconnect();
      }

// this will create the consent screen for user
// auth2 object checks and monitors user's auth status
const initClient = () => {
  gapi.client.init({
      'apiKey': 'AIzaSyDSltVcQfPnkSYy93x53V6H1XCd4ZPje7c',
      'clientId': '690685317347-j08qcmtfihjgi9r2qr352sm4fpjd0d55.apps.googleusercontent.com',
      'scope': 'https://www.googleapis.com/auth/books',
      'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/book/v1/rest'] //constructs methods for interacting with the api
  }).then((something) => {
  	console.log(something, ' this is something')
  	  // Initialize auth2 obj, 
      GoogleAuth = gapi.auth2.getAuthInstance();

      // listen for sign-in state changes.
      GoogleAuth.isSignedIn.listen(updateSigninStatus);

      // Handle initial sign-in state. (Determine if user is already signed in.)
       updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());

      // Call handleAuthClick function when user clicks on
      //      "Sign In/Authorize" button.
      authorizeButton.addEventListener('click', handleAuthClick); 
      signoutButton.on('click', revokeAccess);

  });
};

const handleClientLoad = () => {
        // Load the API client and auth2 library
        gapi.load('client:auth2', initClient);
      }


