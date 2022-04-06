// Create tile layer as map background
console.log("Earthquake Map");

// Get map background
var quakemap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
  
// Create map with options
var map = L.map("map", {
  center: [41.8719,12.5674],
  zoom: 2
});

// Add tile layer to the map
quakemap.addTo(map);

//  Retrieve data
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson").then(function(data) {

  // This function returns the style data for each of the earthquakes we plot on
  function earthqFormat(feature) {
    return {
      opacity: .9,
      fillOpacity: .9,
      fillColor: getColor(feature.geometry.coordinates[2]),
      color: "#000000",
      radius: radiusSize(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }

  // Change the radius of the earthquake marker based on magnitude.
  function radiusSize(magnitude) {
    return magnitude*3;
  }

  // Add layer to the map when file is loaded
  L.geoJson(data, {
    
  // Turn features into markers
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },
    // Set style for each circle
    style: earthqFormat,

    // Create popup for each marker to display earthquake information
    onEachFeature: function(feature, layer) {
      layer.bindPopup(
        "Magnitude: "
          + feature.properties.mag
          + "<br>Depth: "
          + feature.geometry.coordinates[2]
          + "<br>Location: "
          + feature.properties.place
      );
    }
  }).addTo(map);

  // Change color of circle based on the earthquake's magnitude.
  function getColor(Depth) {
   return Depth >= 75
   ? "#d7191c"
   : Depth >= 50
   ? "#F9D607"
   : Depth >= 25
   ? "#13AD51"
   : Depth > 0
   ? "#2c7bb6"
   : "#B4B5AB";
  }

  // Set legend location
  var mapLegend = L.control({position: "topright"});

  // Legend details
  mapLegend.onAdd = function(map) {
    var div = L.DomUtil.create("div", "legend");
        var grades = [0, 25, 50, 75]
        var colors = ["#2c7bb6","#13AD51","#F9D607","#d7191c"]

  // Add details to legend
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML += "<i style='background: " + colors[i] + "'></i> "
        + grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
        }
      return div;
        };

  // Add legend to map
  mapLegend.addTo(map);
});

  
