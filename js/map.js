function prepareMap(){
$(window).resize(function () {
  var h = $(window).height(),
    offsetTop = 125; // Calculate the top offset

  $('#mapCanvas').css('height', (h - offsetTop));
}).resize();

$(function() {

  SearchableMapLib.initialize({
    // commented out file path in case google sheet is lost,
    // but nothing is needed for a sheet
    // filePath: 'data/ReviewsFood.csv',
    filePath: '',
    fileType: 'gsheet',
    recordName: 'Marker', // to complete the phrase: "Hover over a _____"
    recordNamePlural: 'Choices', // to complete the phrase: "## ____ Found"
    map_centroid: [37.6604, -121.8758], // where does the map start at
    defaultZoom:  9,
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
