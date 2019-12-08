function convertCsvToGeojson(data) {
  var csvObject = $.csv.toArrays(data);
  var latName = getColName(csvObject, ['lat', 'Lat', 'LAT', 'latitude', 'Latitude', 'LATITUDE']);
  var lonName = getColName(csvObject, ['lng', 'Lng', 'LNG', 'lon', 'Lon', 'LON', 'longitude', 'Longitude', 'LONGITUDE']);

  return GeoJSON.parse(latLonColumnsToNumbers(massageData(csvObject), latName, lonName), {
    Point: [latName, lonName]
  });
}

function massageData(data) {
  if (!data || !data.length) return null;
  var firstRow = data[0];
  var map = data.map(function(item) {
    var returnItem = {},
      i = 0;
    firstRow.forEach(function(columnName) {
      returnItem[columnName] = item[i++];
    });
    return returnItem;
  });
  //get rid of header
  map.shift();
  return map;
}

function latLonColumnsToNumbers(data, latName, lonName) {
  return data.map(function(item) {
    if (item.hasOwnProperty(latName)) {
      item[latName] = parseFloat(item[latName]);
    }
    if (item.hasOwnProperty(lonName)) {
      item[lonName] = parseFloat(item[lonName]);
    }
    return item;
  });
}

function getColName(data, possibleColumnNames) {
  if (!data || !data.length) return null;
  for (var i = 0; i < data[0].length; i++) {
    if (possibleColumnNames.indexOf(data[0][i]) !== -1) {
      return data[0][i];
    }
  }
  return null;
}