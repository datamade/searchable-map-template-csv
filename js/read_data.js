// const CLIENT_ID = '357835782799-mpgg7fh5hat14ac105qdfld0bbsbrvto.apps.googleusercontent.com';
const API_KEY = 'AIzaSyC4PFgbIb3gaZfqX04NfIUm6yDXvqAEU94';
const SHEET_ID = '1dfrB_p_qotu9qzNWk1Na8w1OreMNM8qykql5NLnJhIw';
const RANGE = 'Food'
const sheet_url='https://sheets.googleapis.com/v4/spreadsheets/' +
SHEET_ID +
'/values/' +
RANGE +
'?key=' +
API_KEY;
let data_as_json;
let data_from_api;

/* This is a function that sends an http request to read the data from a google sheet.
  Once the data is read into the console, it calls prepareMap.
  - All inputs are module-level variables
  - No returned outputs, but `data_from_api` and `data_as_json` are updated via this function.
*/
function getDataFromGoogleSheet() {
  const Http = new XMLHttpRequest();
  Http.open("GET", sheet_url);
  Http.send();

  Http.onload = (e) => {
    data_from_api = Http.responseText;
    data_as_json = JSON.parse(data_from_api);
    // this makes sure that the map function doesn't run before the data has been acquired
    prepareMap();
  }
}

// MAIN CODE TO RUN
if (dataType != 'gsheet') {
  // if data is already loaded, prepare the map!
  prepareMap();
} else {
  // get the data, and when it is loaded, it will call prepareMap()
  getDataFromGoogleSheet();
}
