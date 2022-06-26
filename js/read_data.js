const CLIENT_ID = '357835782799-mpgg7fh5hat14ac105qdfld0bbsbrvto.apps.googleusercontent.com';
const API_KEY = 'AIzaSyC4PFgbIb3gaZfqX04NfIUm6yDXvqAEU94';
const SHEET_ID = '1dfrB_p_qotu9qzNWk1Na8w1OreMNM8qykql5NLnJhIw';

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets.readonly';

let tokenClient;
let gapiInited = false;
let gisInited = false;



//
//
//
/**
* Callback after api.js is loaded.
*/
function gapiLoaded() {
  gapi.load('client', intializeGapiClient);
}

/**
* Callback after the API client is loaded. Loads the
* discovery doc to initialize the API.
*/
async function intializeGapiClient() {
  await gapi.client.init({
    apiKey: API_KEY,
  });
  gapiInited = true;
}

/**
* Callback after Google Identity Services are loaded.
*/
function gisLoaded() {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: '', // defined later
  });
  gisInited = true;
}

function Authorize() {
  tokenClient.callback = async (resp) => {
    if (resp.error !== undefined) {
      throw (resp);
    }
    await listMajors();
  };

  if (gapi.client.getToken() === null) {
    // Prompt the user to select a Google Account and ask for consent to share their data
    // when establishing a new session.
    tokenClient.requestAccessToken({prompt: 'consent'});
  } else {
    // Skip display of account chooser and consent dialog for an existing session.
    tokenClient.requestAccessToken({prompt: ''});
  }
    }

    function initClient() {
          gapi.client.init({
            'apiKey': API_KEY,
            'clientId': CLIENT_ID,
            'scope': SCOPE,
            'discoveryDocs': ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
          }).then(function() {
            gapi.auth2.getAuthInstance().isSignedIn.listen(updateSignInStatus);
            updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
          });
        }
// 1. Load the JavaScript client library.
// gapi.load('client', start);
// start();
//
//
//

function getValues(range, callback) {
  // [START sheets_get_values]
  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: 'Food'
  }).then((response) => {
    var result = response.result;
    var numRows = result.values ? result.values.length : 0;
    console.log(`${numRows} rows retrieved.`);
    // [START_EXCLUDE silent]
    callback(response);
    // [END_EXCLUDE]
  });
  // [END sheets_get_values]
}
