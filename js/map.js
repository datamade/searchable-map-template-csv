let dataType = 'gsheet';
let dataSource = '';
// Option if you want to use a local csv instead
// let dataType = 'csv';
// let dataSource = 'data/ReviewsFood.csv';


function prepareMap(){
$(window).resize(function () {
  var h = $(window).height(),
    offsetTop = 125; // Calculate the top offset

  $('#mapCanvas').css('height', (h - offsetTop));
}).resize();

$(function() {

  let userLocation = [42.35004879803404, -71.12608287847176];
  if (locationAsJSON.success === true){
    userLocation = [locationAsJSON.latitude, locationAsJSON.longitude];
  }

  SearchableMapLib.initialize({
    filePath: dataSource,
    fileType: dataType,
    recordName: 'Marker', // to complete the phrase: "Hover over a _____"
    recordNamePlural: 'Choices', // to complete the phrase: "## ____ Found"
    map_centroid: userLocation, // where does the map start at
    defaultZoom:  10,
    defaultRadius: 1610,
    debug: false,
  });

  var autocomplete = new google.maps.places.Autocomplete(document.getElementById('search-address'));
  var modalURL;

  $('#btnSearch').click(function(){
    // Temporary fix for map load issue: set show map as default.
    if ($('#mapCanvas').is(":visible")){
      SearchableMapLib.doSearch();
    }
    else {
      $('#btnViewMode').html("<i class='fa fa-list'></i> List view");
      $('#mapCanvas').show();
      $('#listCanvas').hide();
      SearchableMapLib.doSearch();
    }
  });

  $(':checkbox').click(function(){
    SearchableMapLib.doSearch();
  });

  $(':radio').click(function(){
    SearchableMapLib.doSearch();
  });

  $('#btnViewMode').click(function(){
    if ($('#mapCanvas').is(":visible")){
      $('#btnViewMode').html("<i class='fa fa-map-marker'></i> Map view");
      $('#listCanvas').show();
      $('#mapCanvas').hide();
    }
    else {
      $('#btnViewMode').html("<i class='fa fa-list'></i> List view");
      $('#listCanvas').hide();
      $('#mapCanvas').show();
    }
  });

  $("#search-address, #search-name").keydown(function(e){
      var key =  e.keyCode ? e.keyCode : e.which;
      if(key == 13) {
          $('#btnSearch').click();
          return false;
      }
  });

  $(".close-btn").on('click', function() {
    $.address.parameter('modal_id', null)
  });

});
}

function formatAddress(prop) {
    return prop["Street1"] + " " + prop["Street2"] + " " + prop["City"] + " " + prop["State"];
}
