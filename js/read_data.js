// const CLIENT_ID = '357835782799-mpgg7fh5hat14ac105qdfld0bbsbrvto.apps.googleusercontent.com';
const API_KEY = 'AIzaSyC4PFgbIb3gaZfqX04NfIUm6yDXvqAEU94';
const SHEET_ID = '1dfrB_p_qotu9qzNWk1Na8w1OreMNM8qykql5NLnJhIw';
const RANGE = 'Food'

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

Http.onreadystatechange = (e) => {
  // console.log(Http.responseText)
  data_from_api = Http.responseText;
}
}

// CODE TO RUN
getDataFromGoogleSheet();
