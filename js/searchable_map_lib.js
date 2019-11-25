var SearchableMapLib = SearchableMapLib || {};
var SearchableMapLib = {

  // parameters to be defined on initialize() 
  map_centroid: [],
  defaultZoom: 9,
  layerUrl: '',
  tableName: '',
  userName: '',
  fields: '',
  listOrderBy: '',
  recordName: '',
  recordNamePlural: '',

  // internal properties
  geoSearch: '',
  whereClause: '',
  radius: '',
  resultsCount: 0,
  currentPinpoint: null,
  lastClickedLayer: null,

  initialize: function(options){

    options = options || {};

    SearchableMapLib.map_centroid = options.map_centroid || [41.881832, -87.623177],
    SearchableMapLib.defaultZoom = options.defaultZoom || 9,
    SearchableMapLib.layerUrl = options.layerUrl || "",
    SearchableMapLib.tableName = options.tableName || "",
    SearchableMapLib.userName = options.userName || "",
    SearchableMapLib.fields = options.fields || "",
    SearchableMapLib.listOrderBy = options.listOrderBy || "",
    SearchableMapLib.recordName = options.recordName || "result",
    SearchableMapLib.recordNamePlural = options.recordNamePlural || "results",
    SearchableMapLib.radius = options.radius || 805,    

    //reset filters
    $("#search-address").val(SearchableMapLib.convertToPlainString($.address.parameter('address')));

    var loadRadius = SearchableMapLib.convertToPlainString($.address.parameter('radius'));
    if (loadRadius != "") 
        $("#search-radius").val(loadRadius);
    else 
        $("#search-radius").val(SearchableMapLib.radius);

    $(":checkbox").prop("checked", "checked");

    var num = $.address.parameter('modal_id');

    if (typeof num !== 'undefined') {
      var sql = new SearchableMap.SQL({ user: SearchableMapLib.userName });
      sql.execute("SELECT " + SearchableMapLib.fields + " FROM " + SearchableMapLib.tableName + " WHERE id = " + num)
      .done(function(data) {
        SearchableMapLib.modalPop(data.rows[0]);
      });
    }

    geocoder = new google.maps.Geocoder();
    // initiate leaflet map
    if (!SearchableMapLib.map) {
      SearchableMapLib.map = new L.Map('mapCanvas', {
        center: SearchableMapLib.map_centroid,
        zoom: SearchableMapLib.defaultZoom,
        scrollWheelZoom: false
      });

      SearchableMapLib.google = new L.Google('ROADMAP', {animate: false});

      SearchableMapLib.map.addLayer(SearchableMapLib.google);

      //add hover info control
      SearchableMapLib.info = L.control({position: 'bottomleft'});

      SearchableMapLib.info.onAdd = function (map) {
          this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
          this.update();
          return this._div;
      };

      // method that we will use to update the control based on feature properties passed
      var hover_template;
      $.get( "/templates/hover.ejs?2", function( template ) {
        hover_template = template;
      });
      SearchableMapLib.info.update = function (props) {
        if (props) {
          this._div.innerHTML = ejs.render(hover_template, {obj: props});
        }
        else {
          this._div.innerHTML = 'Hover over a ' + SearchableMapLib.recordName;
        }
      };

      SearchableMapLib.info.clear = function(){
        this._div.innerHTML = 'Hover over a ' + SearchableMapLib.recordName;
      };

      //add results control
      SearchableMapLib.results_div = L.control({position: 'topright'});

      SearchableMapLib.results_div.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'results-count');
        this._div.innerHTML = "";
        return this._div;
      };

      SearchableMapLib.results_div.update = function (count){
        var recname = SearchableMapLib.recordNamePlural;
        if (count == 1) {
            recname = SearchableMapLib.recordName;
        }

        this._div.innerHTML = count.toLocaleString('en') + ' ' + recname + ' found';
      };

      SearchableMapLib.results_div.addTo(SearchableMapLib.map);
      SearchableMapLib.info.addTo(SearchableMapLib.map);
      
      SearchableMapLib.doSearch();
    }
  },

  doSearch: function() {
    SearchableMapLib.clearSearch();
    var address = $("#search-address").val();
    SearchableMapLib.radius = $("#search-radius").val();

    if (SearchableMapLib.radius == null && address != "") {
      SearchableMapLib.radius = 805;
    }

    if (address != "") {

      geocoder.geocode( { 'address': address }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          SearchableMapLib.currentPinpoint = [results[0].geometry.location.lat(), results[0].geometry.location.lng()];
          $.address.parameter('address', encodeURIComponent(address));
          $.address.parameter('radius', SearchableMapLib.radius);
          SearchableMapLib.address = address;
          SearchableMapLib.createSQL(); // Must call create SQL before setting parameters.
          SearchableMapLib.setZoom();
          SearchableMapLib.addIcon();
          SearchableMapLib.addCircle();
          SearchableMapLib.renderMap();
          SearchableMapLib.renderList();
          SearchableMapLib.getResults();
        }
        else {
          alert("We could not find your address: " + status);
        }
      });
    }
    else { //search without geocoding callback
      SearchableMapLib.map.setView(new L.LatLng( SearchableMapLib.map_centroid[0], SearchableMapLib.map_centroid[1] ), SearchableMapLib.defaultZoom)
      SearchableMapLib.createSQL(); // Must call create SQL before setting parameters.
      SearchableMapLib.renderMap();
      SearchableMapLib.renderList();
      SearchableMapLib.getResults();
    }

  },

  renderMap: function() {
      var layerOpts = {
        user_name: SearchableMapLib.userName,
        type: 'SearchableMap',
        SearchableMap_logo: false,
        sublayers: [
          {
            sql: "SELECT * FROM " + SearchableMapLib.tableName + SearchableMapLib.whereClause,
            Turfcss: $('#maps-styles').html().trim(),
            interactivity: SearchableMapLib.fields
          }
        ]
      }

      SearchableMapLib.dataLayer = SearchableMap.createLayer(SearchableMapLib.map, layerOpts, { https: true })
        .addTo(SearchableMapLib.map)
        .done(function(layer) {
          SearchableMapLib.sublayer = layer.getSubLayer(0);
          SearchableMapLib.sublayer.setInteraction(true);
          SearchableMapLib.sublayer.on('featureOver', function(e, latlng, pos, data, subLayerIndex) {
            $('#mapCanvas div').css('cursor','pointer');
            SearchableMapLib.info.update(data);
          })
          SearchableMapLib.sublayer.on('featureOut', function(e, latlng, pos, data, subLayerIndex) {
            $('#mapCanvas div').css('cursor','inherit');
            SearchableMapLib.info.clear();
          })
          SearchableMapLib.sublayer.on('featureClick', function(e, latlng, pos, data) {
              SearchableMapLib.modalPop(data);
          })
          SearchableMapLib.sublayer.on('error', function(err) {
            console.log('error: ' + err);
          })
        }).on('error', function(e) {
          console.log('ERROR')
          console.log(e)
        });
  },

  renderList: function() {
    var sql = new SearchableMap.SQL({ user: SearchableMapLib.userName });
    var results = $('#results-list');

    if ((SearchableMapLib.whereClause == ' WHERE the_geom is not null AND ') || (SearchableMapLib.whereClause == ' WHERE the_geom is not null ')) {
      SearchableMapLib.whereClause = '';
    }

    var sortClause = ' ';
    if (SearchableMapLib.listOrderBy != '')
      sortClause = ' ORDER BY ' + SearchableMapLib.listOrderBy;

    var sql_ex = "SELECT " + SearchableMapLib.fields + " FROM " + SearchableMapLib.tableName + SearchableMapLib.whereClause + sortClause;
    // console.log(sql_ex);

    results.empty();
    sql.execute(sql_ex)
      .done(function(listData) {
        var obj_array = listData.rows;

        // console.log(obj_array);
        if (listData.rows.length == 0) {
          results.append("<p class='no-results'>No results. Please broaden your search.</p>");
        }
        else {
          var row_content;
          $.get( "/templates/table-row.ejs?4", function( template ) {
              for (idx in obj_array) {

                row_content = ejs.render(template, {obj: obj_array[idx]});

                results.append(row_content);
              }
            });
          }
    }).error(function(errors) {
      console.log("errors:" + errors);
    });
  },

  getResults: function() {
    var sql = new SearchableMap.SQL({ user: SearchableMapLib.userName });

    sql.execute("SELECT count(*) FROM " + SearchableMapLib.tableName + SearchableMapLib.whereClause)
      .done(function(data) {
        SearchableMapLib.resultsCount = data.rows[0]["count"];
        SearchableMapLib.results_div.update(SearchableMapLib.resultsCount);

        var recname = SearchableMapLib.recordNamePlural;
        if (SearchableMapLib.resultsCount == 1) {
            recname = SearchableMapLib.recordName;
        }

        $('#list-result-count').html(SearchableMapLib.resultsCount.toLocaleString('en') + ' ' + recname + ' found')
      }
    );
  },

  modalPop: function(data) {

    var modal_content;
    $.get( "/templates/popup.ejs?1", function( template ) {
        modal_content = ejs.render(template, {obj: data});
        $('#modal-pop').modal();
        $('#modal-main').html(modal_content);
        $.address.parameter('modal_id', data.SearchableMap_id);
      });
  },

  clearSearch: function(){
    if (SearchableMapLib.sublayer) {
      SearchableMapLib.sublayer.remove();
    }
    if (SearchableMapLib.centerMark)
      SearchableMapLib.map.removeLayer( SearchableMapLib.centerMark );
    if (SearchableMapLib.radiusCircle)
      SearchableMapLib.map.removeLayer( SearchableMapLib.radiusCircle );
  },

  createSQL: function() {
     // Devise SQL calls for geosearch and language search.
    var address = $("#search-address").val();

    if(SearchableMapLib.currentPinpoint != null && address != '') {
      SearchableMapLib.geoSearch = " AND ST_DWithin(ST_SetSRID(ST_POINT(" + SearchableMapLib.currentPinpoint[1] + ", " + SearchableMapLib.currentPinpoint[0] + "), 4326)::geography, the_geom::geography, " + SearchableMapLib.radius + ")";
    }
    else {
      SearchableMapLib.geoSearch = ''
    }

    SearchableMapLib.whereClause = " WHERE the_geom is not null ";

    //-----custom filters-----

    if ($('#start-date').val())
      SearchableMapLib.whereClause += " AND created_date >= '" + $('#start-date').val() + "'";
    if ($('#end-date').val())
      SearchableMapLib.whereClause += " AND created_date <= '" + $('#end-date').val() + "'";

    // this logic is a bit funny since we're keying off the presence of a value instead of a type column
    if ( $("#cbType1").is(':checked') && $("#cbType2").is(':checked'))
      SearchableMapLib.whereClause += " AND (docket_number is not null OR docket_number is null)";
    else {
      if ( $("#cbType1").is(':checked'))
        SearchableMapLib.whereClause += " AND docket_number is not null ";
      if ( $("#cbType2").is(':checked'))
        SearchableMapLib.whereClause += " AND docket_number is null ";
    }
    // -----end of custom filters-----

    if (SearchableMapLib.geoSearch != "") {
      SearchableMapLib.whereClause += SearchableMapLib.geoSearch;
    }
  },

  setZoom: function() {
    var zoom = '';
    if (SearchableMapLib.radius >= 8050) zoom = 12; // 5 miles
    else if (SearchableMapLib.radius >= 3220) zoom = 13; // 2 miles
    else if (SearchableMapLib.radius >= 1610) zoom = 14; // 1 mile
    else if (SearchableMapLib.radius >= 805) zoom = 15; // 1/2 mile
    else if (SearchableMapLib.radius >= 400) zoom = 16; // 1/4 mile
    else zoom = 16;

    SearchableMapLib.map.setView(new L.LatLng( SearchableMapLib.currentPinpoint[0], SearchableMapLib.currentPinpoint[1] ), zoom)
  },

  addIcon: function() {
    SearchableMapLib.centerMark = new L.Marker(SearchableMapLib.currentPinpoint, { icon: (new L.Icon({
            iconUrl: '/img/blue-pushpin.png',
            iconSize: [32, 32],
            iconAnchor: [10, 32]
    }))});

    SearchableMapLib.centerMark.addTo(SearchableMapLib.map);
  },

  addCircle: function() {
    SearchableMapLib.radiusCircle = new L.circle(SearchableMapLib.currentPinpoint, SearchableMapLib.radius, {
        fillColor:'#1d5492',
        fillOpacity:'0.1',
        stroke: false,
        clickable: false
    });

    SearchableMapLib.radiusCircle.addTo(SearchableMapLib.map);
  },

  //converts a slug or query string in to readable text
  convertToPlainString: function(text) {
    if (text == undefined) return '';
    return decodeURIComponent(text);
  },

  // -----custom functions-----
  getColor: function(docket_number){
    if (docket_number != null) return 'red';
    return 'blue';
  },
  // -----end custom functions-----

}