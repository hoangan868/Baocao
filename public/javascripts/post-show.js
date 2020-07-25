mapboxgl.accessToken = mapBoxToken;
console.log(mapBoxToken);
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v10',
  center: post.geometry.coordinates,
  zoom: 18
});
map.addControl(new mapboxgl.FullscreenControl());

// create a HTML element for our post location/marker
var el = document.createElement('div');
el.className = 'marker';

// var coordinates = document.getElementById('coordinates');
// var marker = new mapboxgl.Marker({
// 	draggable: true
// 	})
// 	.setLngLat([post.geometry.coordinates[0], post.geometry.coordinates[1]])
// 	.addTo(map);
	 
// 	function onDragEnd() {
// 	var lngLat = marker.getLngLat();
// 	coordinates.style.display = 'block';
// 	coordinates.innerHTML ='<input value='+ lngLat.lng +'>'+ '<br/><input value = '+ lngLat.lat +'>';
// 	// 'Longitude: ' + lngLat.lng + '<br />Latitude: ' + lngLat.lat;
// 	console.log(lngLat);
// 	}
	 
// 	marker.on('dragend', onDragEnd);

// make a marker for our location and add to the map
new mapboxgl.Marker(el)
.setLngLat(post.geometry.coordinates)
.setPopup(new mapboxgl.Popup() // add popups
.setHTML(
	'<h3>' + post.title + '</h3>'))
.addTo(map);

// Toggle edit review form
$('.toggle-edit-form').on('click', function() {
	// toggle the edit button text on click
	$(this).text() === 'Edit' ? $(this).text('Cancel') : $(this).text('Edit');
	// toggle visibility of the edit review form
	$(this).siblings('.edit-review-form').toggle();
});

// Add click listener for clearing of rating from edit/new form
$('.clear-rating').click(function() {
	$(this).siblings('.input-no-rate').click();
});











