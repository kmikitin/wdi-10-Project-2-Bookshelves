// RUN EXPRESS SERVER TO DO THIS

console.log('linked');

// const GoogleAuth; // Google Auth object.

// const initClient = () => {
//   gapi.client.init({
//       'apiKey': 'AIzaSyCs-qsUbQGv9LQ6OKVW_pqT6A8MHQ0srog',
//       'clientId': '690685317347-qa60naeh1diiu2vh0mmtm3lkg3iicl83.apps.googleusercontent.com',
//       'scope': 'https://www.googleapis.com/auth/books',
//       'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/book/v1/rest']
//   }).then(function () {
//       GoogleAuth = gapi.auth2.getAuthInstance();

//       // Listen for sign-in state changes.
//       GoogleAuth.isSignedIn.listen(updateSigninStatus);
//   });
// };


GoogleAuth.signIn();
