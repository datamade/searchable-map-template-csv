# Searchable Map Template - CSV

You want to put your data on a searchable, filterable map. Provide a comma separated file (CSV) and this free, open source template will do the rest. This template is a successor to Derek Eder's [Fusion Tables Map Template](https://github.com/derekeder/FusionTable-Map-Template).

**[See the working demo &raquo;](https://searchable-map-template-csv.netlify.com/)**

![searchable-map-template-turf](https://raw.githubusercontent.com/datamade/searchable-map-template-turf/master/img/screenshot.jpg)

## Features

* address search (with variable radius and geocomplete)
* results count
* powered by Turfjs and plain ol' javascript
* map and list view modes
* large info windows when clicking on a point
* easy customization of hover, popup and table views
* RESTful URLs for sharing searches
* ability to easily add additional search filters (checkboxes, sliders, etc)
* mobile and tablet friendly using responsive design (Bootstrap 4)
* built with HTML, CSS and Javascript - no server side code required

## Dependencies

This template depends on other JS libraries and resources:

* [Bootstrap 4](https://getbootstrap.com/) - Responsive CSS and HTML framework
* [Leaflet](https://leafletjs.com) - Rendering the interactive map
* [Turf.js](https://Turf.com) - Geospatial filtering
* [Google Maps Javscript API](https://developers.google.com/maps/documentation/javascript/tutorial) - Geocoding and the Places API
* [leaflet-color-markers](https://github.com/pointhi/leaflet-color-markers) - A set of colored map markers
* [csv-to-geojson](https://github.com/gavinr/csv-to-geojson) - Converts CSV files to GeoJSON
* [jQuery 3.3.1](https://jquery.com/) - Javascript utility
* [jQuery Address](https://github.com/asual/jquery-address) - For stateful URLs
* [Moment.js](https://momentjs.com/) - Manipulating dates and times in javascript


## Differences between this template and the Fusion Tables Map Template

This template borrows heavily from Derek Eder's [Fusion Tables Map Template](https://github.com/derekeder/FusionTable-Map-Template) and follows a similar code pattern and architecture. It is intended to be easy to pick up and modify by people with limited coding experience and not require anything to be installed on your computer or server to run it. 

That being said, there are some differences between this template and the Fusion Tables Map Template, namely:

* **Powered by Turf.js instead of Fusion Tables**. This map has no back-end service powering it. It's all done in the browser with the help of [Turf.js](https://turfjs.org/).
* **Using Bootstrap 4**. I upgraded to the latest version of Boostrap when building this template. There are some notable changes in syntax with these versions, [which are documented here](https://getbootstrap.com/docs/4.3/migration/).
* **List view included by default**. I decided to include the list view mode by default, as it is the best way to view results on a mobile phone. It requires editing an additonal template `templates/table-row.ejs` but I think is worth the extra work to customize.
* **Hover functionality**. Because it was pretty to do in Leaflet, this template includes the ability to hover over a point and see a preview of the point data before clicking on it.
* **Data size limits**. Because this template loads all the data into your browser, there are limitations to how any points you can display. Showing more than a 1,000 points may make your browser quite slow.


## Setup

Follow the steps below and you'll be in business with your own map.

### Step 1: Get and prep your data

This template will work with data in [csv](https://en.wikipedia.org/wiki/Comma-separated_values) and [geojson](https://en.wikipedia.org/wiki/GeoJSON) formats.

If you have an `xls` or `xlsx` spreadsheet, you can save it as a `csv` file from Excel, Numbers, Libre Office or your spreadsheet tool of choice.

The `csv` file must have a latitude column and longitude column and all rows must be geocoded. If you don't have this, but have information like a street address, you'll need to [geocode](https://en.wikipedia.org/wiki/Geocode) your data.

Here's a few tools for geocoding:

* Google has the best geocoder in terms of accuracy. They have an [API that you can use](https://developers.google.com/maps/documentation/geocoding/start), but may cost you money depending on how many rows you have to geocode.
* To geocode addresses inside Google Sheets, install the [free Geocoding by SmartMonkey Add-On for Google Sheets](https://gsuite.google.com/marketplace/app/geocoding_by_smartmonkey/1033231575312). See [geocoding instructions in Hands-On Data Visualization](https://handsondataviz.org/geocode.html).
* [Geocoding in QGIS](https://www.gislounge.com/how-to-geocode-addresses-using-qgis/) (uses OpenStreetMap)
* [BatchGeo](https://www.batchgeo.com/) 
* [Texas A&M](http://geoservices.tamu.edu/Services/Geocode/)

### Step 2: Download and edit this template 

1. Download or clone this project and fire up your text editor of choice. Open up `/js/map.js` and set your map options in the `SearchableMapLib.initialize` function:
  - `map_centroid` -  the lat/long you want your map to center on ([find yours here](https://getlatlong.net/))
  - `filePath` - Path to your map data file. This file needs to be in csv or geojson format and placed in the `data` folder. This file's first line must be the header, and it must have a latitude column and longitude column. 
  - `fileType` - Set if you are loading in a `csv` or `geojson` file
2. Edit the templates in the `templates` folder for how you want your data displayed. These templates use EJS, which allows the display of your variables with HTML, as well as conditional logic. [Documentation is here](https://ejs.co/#docs). 
  - `/templates/hover.ejs` - template for when you hover over a dot on the map
  - `/templates/popup.ejs` - template for when a dot on the map is clicked
  - `/templates/table-row.ejs` - template for each row in the list view
3. Remove the custom filters and add your own. 
  -  `index.html` - custom HTML for filters starts around line 112
  - `/js/searchable_map_lib.js` - logic for custom filters starts around line 265

### Step 3: Running it locally

Once you've made your changes, you'll want to test the map to make sure it works. To view it in your browser, you'll need to run a web server on your computer. It can be any web server, but here are some ones I suggest using:

* HTTP Party's [http-server](https://github.com/http-party/http-server). Once its installed, you can run `npx http-server . -c-1` from the command line.
* If you have python installed, you can run this from the command line (note, you can see what version of python you have by typing `python --version): 
  - python 2: `python -m SimpleHTTPServer`
  - python 3: `python -m http.server`
* If you have one you'd like to add to this list (especially one for Windows machines, please [add a comment to this issue](https://github.com/datamade/searchable-map-template-csv/issues/13))

### Step 4: Debugging - common issues/troubleshooting

If your map isn't displaying any data, try the following:

1. Set the `debug` option in SearchableMapLib.initialize to `true`.
1. Use the [Firefox page inspector](https://developer.mozilla.org/en-US/docs/Tools/Page_Inspector/UI_Tour) or  [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools/). This will allow you to view and debug your javascript.
1. Load your map in the browser and open the javascript console 
   * Chrome DevTools on a Mac: Option+Command+J
   * Chrome DevTools on a PC: Control+Shift+J
   *  Firefox Page Inspector: Tools => Web Developer => Web Console) 
1. If you do see javascript errors:
   * The error will tell you what line it is failing on. Best to start by going there!
   * Columns you reference from your CSV file are case sensitive and must be exaclty the same.

### Step 5: Publishing your map

1. Before you publish, you'll need to [get a Google API key](https://developers.google.com/maps/documentation/javascript/get-api-key). You can get on here. Replace the API key on this line of `index.html` with yours: `<script type="text/javascript" src="https://maps.google.com/maps/api/js?libraries=places&key=[YOUR KEY HERE]"></script>`
2. Upload this map and all the supporting files and folders to your site. This map requires no back-end code, so any host will work, including GitHub pages, Netlify or your own web server.

## SearchableMapLib options

You can configure your map by passing in a dictionary of options when you call the `SearchableMapLib.initialize` function in `/js/map.js`. Here's an example:

```javascript
SearchableMapLib.initialize({
    filePath: 'data/chicago-flu-shot-locations-2019.csv',
    fileType: 'csv',
    recordName: 'flu shot location',
    recordNamePlural: 'flu shot locations',
    map_centroid: [41.85754, -87.66231],
    defaultZoom:  11,
    defaultRadius: 1610,
    debug: false,
  });
```

| Option           | Default value           | Notes                                                                                                           |
|------------------|-------------------------|-----------------------------------------------------------------------------------------------------------------|
| map_centroid     | [41.881832, -87.623177] | Center [latitude, longitude] that your map shows when it loads. Defaults to Chicago.                            |
| defaultZoom      | 9                      | Default zoom level when map is loaded (bigger is more zoomed in).                                               |
| defaultRadius           | 805                     | Default search radius. Defined in meters. Default is 1/2 mile.                                                  |
| filePath         |                         | The path to your csv or geojson file that contains your map data. This file should be put in the data directory |
| fileType         | csv                     | File type to load in. Supports csv or geojson                                                                   |                                                                     |
| recordName       | record                  | Used for showing the count of results.                                                                          |
| recordNamePlural | records                 |                                                                                                                 |
| debug            | false                   | Used to turn on helpful messages when debugging (see section on Debugging - common issues/troubleshooting)           |

## Resources

For making customizations to this template
* [Bootstrap 4 documentation](https://getbootstrap.com/docs/4.3/getting-started/introduction/)
* [EJS documentation](https://ejs.co/#docs)
* [Leaflet documentation](https://leafletjs.com/reference-1.5.0.html)
* [moment.js documentation](https://momentjs.com/docs/)

## Errors and Bugs

If something is not behaving intuitively, it is a bug, and should be reported.
Report it here: https://github.com/datamade/searchable-map-template-turf/issues
