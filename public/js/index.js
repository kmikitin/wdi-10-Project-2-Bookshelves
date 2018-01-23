console.log('Linked')      

let isAuthorized = false;

  const sendAuthorizedApiRequest = (requestDetails) => {
  currentApiRequest = requestDetails;
  console.log('is this called')
  if (isAuthorized) {
    // Make API request
    console.log('is this magically called when authorized')
    // gapi.client.request(requestDetails)
    const request = gapi.client.request({
      'method': 'GET',
      'path': 'https://www.googleapis.com/books/v1/mylibrary/bookshelves',
      'params': {'part': 'snippet', 'mine': 'true'}
    })

    console.log(request, ' this is request')
    request.execute(function(response) {
      console.log(response)
    })
    // Reset currentApiRequest variable.
    currentApiRequest = {};
  } else {
    GoogleAuth.signIn();
  }
}
  var GoogleAuth;
  var SCOPE = 'https://www.googleapis.com/auth/books';
  function handleClientLoad() {
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
      console.log(user, ' this is user, is my toke in here')
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
      sendAuthorizedApiRequest(isAuthorized)
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
