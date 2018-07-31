
var google;

function init() {
    // Basic options for a simple Google Map
    // For more options see: https://developers.google.com/maps/documentation/javascript/reference#MapOptions
    // var myLatlng = new google.maps.LatLng(40.71751, -73.990922);
    var myLatlng = new google.maps.LatLng(53.4239, -7.9407);
    // 39.399872
    // -8.224454
    
    var mapOptions = {
        // How zoomed in you want the map to start at (always required)
        zoom: 8,

        // The latitude and longitude to center the map (always required)
        center: myLatlng,

        // How you would like to style the map. 
        scrollwheel: false,
        styles: [{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#B2D430"},{"lightness":100}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#B2D430"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#B2D430"},{"lightness":90}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#B2D430"},{"lightness":50},{"weight":1.2}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#B2D430"},{"lightness":25}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#B2D430"},{"lightness":21}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#B2D430"},{"lightness":7}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#B2D430"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#B2D430"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#B2D430"},{"lightness":16}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#B2D430"},{"lightness":19}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#B2D430"},{"lightness":17}]}]
    };

    

    // Get the HTML DOM element that will contain map 
    // We are using a div with id="map" seen below in the <body>
    var mapElement = document.getElementById('map');

    // Create the Google Map using our element and options defined above
    var map = new google.maps.Map(mapElement, mapOptions);
	
	// Create Markers on Google Maps for each location
	/*var marker = new google.maps.Marker({
	position: {lat:53.4180,lng:-7.9036},
	map:map
	});
	
	// Information Window to pop up when the click function is used to view details of location
	var infoWindow = new google.maps.InfoWindow({
	content:'<h6>AIT Sports Camps</h6>'
	});
	
	// Click function to display location information
	marker.addListener('click', function(){
	infoWindow.open(map, marker);
	}); */
	
	
	// Use an Array of Markers - This is cleaner than creating a marker for each location and the functionality required to display details of location 
	
	var markers = [
	{coords:{lat:53.4180,lng:-7.9036}, content:'<h6>AIT: AIT Sports/FAI Soccer Schools/GAA Cul Camp/Anyone4Science Camps</h6>'},
	{coords:{lat:53.4241,lng:-7.9195}, content:'<h6>Lets Go Camps - Athlone Community College</h6>'},
	{coords:{lat:53.4629,lng:-7.9912}, content:'<h6>Hodson Bay: FAI Soccer Schools/Baysports Camps</h6>'},
	{coords:{lat:53.5435,lng:-8.0477}, content:'<h6>FAI Soccer Schools Camps - St Johns Lecarrow</h6>'},
	{coords:{lat:53.4244,lng:-7.8976}, content:'<h6>GAA Cul Camps - Garrycastle</h6>'},
	{coords:{lat:53.3967,lng:-7.7260}, content:'<h6>GAA Cul Camps - Moate Community School</h6>'},
	{coords:{lat:53.3689,lng:-8.0206}, content:'<h6>GAA Cul Camps - Clann na nGael GAA</h6>'},
	{coords:{lat:53.3899,lng:-8.4748}, content:'<h6>GAA Cul Camps - Padraig Pearses GAA</h6>'},
	{coords:{lat:53.4291,lng:-7.9217}, content:'<h6>Athlone Regional Sports Centre Camps</h6>'},
	{coords:{lat:53.4113,lng:-7.9891}, content:'<h6>Sparkademy STEM Camps</h6>'},
	{coords:{lat:53.4222,lng:-7.9713}, content:'<h6>Shannon Dance Academy Ballet Camps</h6>'},
	{coords:{lat:53.4288,lng:-7.8761}, content:'<h6>Athlone Equestrian Centre Pony Camps</h6>'}
	
	];
	
	//Loop through Markers
	for(var i = 0;i < markers.length;i++){
	//Add Marker
	addMarker(markers[i]);
	}
	
	// Add Marker Function
	function addMarker(props){
	var marker = new google.maps.Marker({
	position:props.coords,
	map:map
	});
	
	//Check for Content
	if(props.content){
	var infoWindow = new google.maps.InfoWindow({
	content:props.content
	});
	
	// Click function to display location information
	marker.addListener('click', function(){
	infoWindow.open(map, marker);
	});
	}
	}
    
	// End of Markers Functionality
	
    var addresses = ['Athlone'];

    for (var x = 0; x < addresses.length; x++) {
        $.getJSON('http://maps.googleapis.com/maps/api/geocode/json?address='+addresses[x]+'&sensor=false', null, function (data) {
            var p = data.results[0].geometry.location
            var latlng = new google.maps.LatLng(p.lat, p.lng);
            new google.maps.Marker({
                position: latlng,
                map: map,
                icon: 'img/loc.png'
            });

        });
    }
    
}
google.maps.event.addDomListener(window, 'load', init);
