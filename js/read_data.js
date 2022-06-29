// const CLIENT_ID = '357835782799-mpgg7fh5hat14ac105qdfld0bbsbrvto.apps.googleusercontent.com';
const API_KEY = 'AIzaSyC4PFgbIb3gaZfqX04NfIUm6yDXvqAEU94';
const SHEET_ID = '1dfrB_p_qotu9qzNWk1Na8w1OreMNM8qykql5NLnJhIw';
const RANGE = 'Food'
let data_as_json;
let data_from_api;

function getDataFromGoogleSheet() {
  const Http = new XMLHttpRequest();
  const url='https://sheets.googleapis.com/v4/spreadsheets/' +
            SHEET_ID +
            '/values/' +
            RANGE +
            '?key=' +
            API_KEY;
Http.open("GET", url);
Http.send();

Http.onload = (e) => {
  // console.log(Http.responseText)
  data_from_api = Http.responseText;
  data_as_json = JSON.parse(data_from_api);
  prepareMap();
}
}

// CODE TO RUN
getDataFromGoogleSheet();
