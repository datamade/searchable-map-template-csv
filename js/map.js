$(window).resize(function () {
  var h = $(window).height(),
    offsetTop = 125; // Calculate the top offset

  $('#mapCanvas').css('height', (h - offsetTop));
}).resize();

$(function() {

  SearchableMapLib.initialize({
    map_centroid: [41.85754, -87.66231],
    defaultZoom:  11,
    layerUrl:     'https://datamade.Turf.com/api/v2/viz/3d861410-d645-4c10-a19d-ef01c1135441/viz.json',
    tableName:    'flu_shot_locations_2014_present_2019_2020_season',
    userName:     'datamade',
    fields :      'SearchableMap_id, the_geom, cost, facility_name, hours, phone, street1, street2, city, state, url',
    listOrderBy: 'facility_name',
    recordName: 'flu shot location',
    recordNamePlural: 'flu shot locations',
    radius: 1610,
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

  $("#search-address").keydown(function(e){
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

function formatAddress(prop) {
    return prop.street1 + " " + prop.street2 + " " + prop.city + " " + prop.state;
}