var webservice = 'http://10.135.13.9:5432/places';

document.addEventListener('deviceready', function() {
        console.log( 'APP init and device ready!' );
	
	$(document).ready(function(){
		$.ajax({
			url:webservice,
			type:'GET',
			success:function(d){
				console.log(d);
			},
			error:function(){
			alert('Es geht etwas nicht...');
		}
		});
		
	});
	
	
		// Darstellung Orte
	var loadPlaces = function() {
		$.ajax({
			url:'http://localhost:5432/places',
			type:'GET',
			success:function(d) {
				$( '#places' ).empty();
				for (var i in d.places ) {
					console.log( d.places[i] );
					if ( d.places[i].name ) {
						$( '<table class="table table-striped btn-group-vertical">' )
							.attr( 'data-id', i )
							.appendTo( '#places' )
							.html( d.places[i].name + '( '+d.places[i].lat +'/'+d.places[i].lng +' )')
							.append(
								$( '<br><button type="submit" class="delPlace btn btn-warning">Löschen</button>' )
							)
					}
				}
			}
		});
	}

	// wenn Seite ladet, zeige alle gespeicherten Orte
	$( document ).ready( function() {
		loadPlaces();
	})
	
	$(document).ready(function(){
		
		$('input[type=text]').val('');
		loadPlaces();
		
		
		var map = new google.maps.Map($('#googlemaps').get(0),{
			center:{lat:0,lng:0},
			zoom:3
		});
		
		navigator.geolocation.getCurrentPosition(function(position){
		 var userPos = {
			 lat:position.coords.latitude,
			 lng:position.coords.longitude
			 
		 };
		map.setCenter(userPos);
		map.setZoom(15);
			
		var marker = new google.maps.Marker({
			position:userPos,
			map:map
			
			
		});
			
		});
	
		
	})
		
	
	
}, false);
