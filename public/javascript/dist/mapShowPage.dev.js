"use strict";

mapboxgl.accessToken = mapToken;
var map = new mapboxgl.Map({
  container: 'cluster-map',
  // container ID
  style: 'mapbox://styles/mapbox/streets-v11',
  // style URL
  center: campground.geometry.coordinates,
  // starting position [lng, lat]
  zoom: 9 // starting zoom

});
map.addControl(new mapboxgl.NavigationControl());
new mapboxgl.Marker().setLngLat(campground.geometry.coordinates).setPopup(new mapboxgl.Popup({
  offset: 25
}).setHTML("<h3>".concat(campground.title, "</h3><p>").concat(campground.location, "</p>"))).addTo(map);