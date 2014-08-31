
var markerImg = "assets/img/location.png";
var markerA = "assets/img/markerA.png";
var arrivee, transport, typeParcours;

var markersArray = [];
var i = 0;
var positionTimer;
var timer =  0;
var distanceM;



$(document).on('pagebeforeshow', '#parcours', function(e, data){


    // Stop géolocalisation si clique sur le bouton pause
    $("#pauseWatch").click(function(){

        var status = $("#stopGeolocation").is(":checked");
        if(status == false){
            navigator.geolocation.clearWatch(positionTimer);
        } else {

            console.log("Reprise de la géolocalisation");
            setLocation();
        }

    });

    // Stop géolocalisation + alert en cas d'arret du parcours
    $("#backSubmit").click(function(){
        alert("Êtes-vous sûr de vouloir quitter le parcours ?");
        // Stop géolocalisation
        navigator.geolocation.clearWatch(positionTimer);

    });

    $("#bilanOK").click(function(){
        // Stop géolocalisation
        navigator.geolocation.clearWatch(positionTimer);

    });



    arrivee = data.prevPage.find('input:text[name=arrivee]').val();
    transport = data.prevPage.find('input:radio[name=transport]:checked').val();
    typeParcours = data.prevPage.find('#typeParcours option:selected').val();


});




$(document).on('pageshow', '#parcours', function (event) {
    // This is the location marker that we will be using
    // on the map. Let's store a reference to it here so

    if (typeParcours === "nature"){
        mapType = "TERRAIN";
    } else {
        mapType = "ROADMAP";
    }



    // Get the map container node.
    var mapContainer = $( "#map-canvas" );

    // Create the new Goole map controller using our
    // map (pass in the actual DOM object). Center it
    // above the first Geolocated IP address.
    map = new google.maps.Map(
        mapContainer[ 0 ],
        {
            zoom: 10,
            center: new google.maps.LatLng(
                48.877547, 2.357875
            ),
            mapTypeId: google.maps.MapTypeId[mapType],
            // OPTIONS CONTROLES MAP
            zoomControl: true,
            zoomControlOptions: {
                style: google.maps.ZoomControlStyle.LARGE,
                position: google.maps.ControlPosition.LEFT_CENTER
            },
            streetViewControl: false,
            mapTypeControl: false,
            panControl: false
        }
    );


    // I add a marker to the map using the given latitude
    // and longitude location.
    function addMarker( latitude, longitude, label ){
        // Create the marker - this will automatically place it
        // on the existing Google map (that we pass-in).



        marker = new google.maps.Marker({
            map: map,
            icon: markerImg,
            position: new google.maps.LatLng(
                latitude,
                longitude
            ),
            title: (label || "")
        });


        // Return the new marker reference.
        return( marker );
    }


    // I update the marker's position and label.
    function updateMarker( marker, latitude, longitude, label ){
        // Update the position.
        marker.setPosition(
            new google.maps.LatLng(
                latitude,
                longitude
            )
        );


        // Update the title if it was provided.
        if (label){

            marker.setTitle( label );

        }


    }


    // -------------------------------------------------- //
    // -------------------------------------------------- //
    // -------------------------------------------------- //
    // -------------------------------------------------- //


    // Check to see if this browser supports geolocation.
    if (navigator.geolocation) {



        // that it can be updated in several places.
        var locationMarker = null;


        // Get the location of the user's browser using the
        // native geolocation service. When we invoke this method
        // only the first callback is requied. The second
        // callback - the error handler - and the third
        // argument - our configuration options - are optional.
        navigator.geolocation.getCurrentPosition(
            function( position ){

                timer = 0;

                // Check to see if there is already a location.
                // There is a bug in FireFox where this gets
                // invoked more than once with a cahced result.
                if (locationMarker){
                    return;
                }

                // Log that this is the initial position.
                console.log( "Initial Position Found" );

                // Add a marker to the map using the position.
                locationMarker = addMarker(
                    position.coords.latitude,
                    position.coords.longitude,
                    "Initial Position"
                );

                var origin = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);




                // REQUETE GOOGLE MAPS

                var directionsService = new google.maps.DirectionsService(),
                    directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true});


                travel = {
                    origin : origin,
                    destination : arrivee,
                    travelMode : google.maps.DirectionsTravelMode[transport]

                };

                directionsDisplay.setMap(map);




                directionsService.route(travel, function(result, status) {
                        if (status === google.maps.DirectionsStatus.OK) {
                            directionsDisplay.setDirections(result);

                            //var distanceDirection = result.routes[0].legs[0].steps[0].distance.text;
                            //var iconDirection = result.routes[0].legs[0].steps[0].maneuver;
                            var distanceTotal = result.routes[0].legs[0].distance.text;
                            distanceM = result.routes[0].legs[0].distance.value;


                            /*
                             //AFFICHAGE DES ICONES EN FONCTION DE DU PROCHAIN CHANGEMENT ITINERAIRE
                             if( iconDirection == "turn-sharp-left" || iconDirection == "roundabout-left" || iconDirection == "uturn-left" || iconDirection == "turn-slight-left" || iconDirection == "turn-left" || iconDirection == "fork-left" || iconDirection == "ramp-left" || iconDirection == "keep-left" ){
                             iconDirection = "<i class = 'fa fa-arrow-circle-o-left'></i> ";
                             }
                             else if( iconDirection == "roundabout-right" || iconDirection == "uturn-right" || iconDirection == "turn-slight-right" || iconDirection == "keep-right" || iconDirection == "turn-sharp-right" || iconDirection == "ramp-right" || iconDirection == "turn-right" || iconDirection == "fork-right"){
                             iconDirection ="<i class = 'fa fa-arrow-circle-o-right'></i> ";
                             }else {
                             iconDirection ="<i class = 'fa fa-arrow-circle-o-up'></i> ";
                             }


                             $("#dirParcours").html("<p>" + iconDirection + distanceDirection + "</p>");

                             */
                            $("#distParcours").html("<p><i class='fa fa-location-arrow fa-lg'></i> " + distanceTotal + "</p>");

                        }


                        // REQUETE AFFICHAGE POINTS STRATEGIQUES

                        var endLocation = new google.maps.LatLng(result.routes[0].legs[0].end_location.k, result.routes[0].legs[0].end_location.B);

                        var arrivalMarker = new google.maps.Marker({
                            map: map,
                            icon: markerA,
                            position: endLocation
                        });
                        /*
                         // Récupération de la distance du trajet radius autour de l'arrivée
                         var distanceRadius = result.routes[0].legs[0].distance.value;
                         // Si la distance du trajet est supérieur à 10 km on fait un radius de 10 km autour du point d'arrivée
                         if(distanceRadius > 5000) { distanceRadius = 5000; }
                         */




                    },
                    function( error ){
                        console.log( "Something went wrong: ", error );
                    },
                    {
                        timeout: (15 * 1000),
                        maximumAge: (1000 * 60 * 15),
                        enableHighAccuracy: true
                    }
                );


                // Now tha twe have asked for the position of the user,
                // let's watch the position to see if it updates. This
                // can happen if the user physically moves, of if more
                // accurate location information has been found (ex.
                // GPS vs. IP address).
                //
                // NOTE: This acts much like the native setInterval(),
                // invoking the given callback a number of times to
                // monitor the position. As such, it returns a "timer ID"
                // that can be used to later stop the monitoring.



                setLocation();




            }
        );


        // If the position hasn't updated within 5 minutes, stop
        // monitoring the position for changes.
        setTimeout(
            function(){
                // Clear the position watcher.
                navigator.geolocation.clearWatch( positionTimer );
            },
            (1000 * 60 * 5)
        );

    }

    function setLocation(){



        positionTimer = navigator.geolocation.watchPosition(
            function( position ){
                var locationPlace = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                function center(){
                    // CENTRAGE DE LA CARTE SUR LE NOUVEAU MARKER + ZOOM

                    var mapOpt = {
                        center: locationPlace
                    };
                    map.setOptions(mapOpt);

                }

                $("#centerBtn").click(function(){
                    center();
                });
                // Zoom et centrage sur le marker
                if(timer == 0){
                    var mapOpt = {
                        zoom: 17,
                        center: locationPlace
                    };
                    map.setOptions(mapOpt);
                }

                timer = timer+5;


                // Log that a newer, perhaps more accurate
                // position has been found.
                console.log( "Newer Position Found" );

                // Set the new position of the existing marker.
                updateMarker(
                    locationMarker,
                    position.coords.latitude,
                    position.coords.longitude,
                    "Updated / Accurate Position"
                );




                console.log(typeParcours);

                if(typeParcours === "gastronomique") {

                    var requestPlace = {
                        location:  locationPlace,
                        radius: 1000,
                        types: ['restaurant']
                    };

                    var markerR = "assets/img/markerR.png";

                    // CONDITIONS POUR MISE A JOUR DES RESTAURANTS MOINS FREQUENTE
                    if(i == 0){

                        showPlaces();
                    }

                    i++;
                    if(i == 30){

                        i = 0;
                    }


                }





                // AFFICHAGE POPUP UNE FOIS ARRIVE A DESTINATION
                if(distanceM < 50){
                    $('#popupSearch').popup('open');

                 }








                // AFFICHAGE DES POINTS D'INTERETS

                function showPlaces() {

                    // MISE A JOUR DES POINTS D'INTERETS
                    function clearOverlays(callback) {
                        for (var i = 0; i < markersArray.length; i++ ) {
                            markersArray[i].setMap(null);
                        }
                        callback();
                    }

                    clearOverlays(reset);

                    // Reset
                    function reset(){
                        markersArray.length = 0;

                    }

                    infowindow = new google.maps.InfoWindow();
                    var service = new google.maps.places.PlacesService(map);
                    service.nearbySearch(requestPlace, callback);


                    function callback(results, status) {
                        if (status == google.maps.places.PlacesServiceStatus.OK) {
                            for (var i = 0; i < results.length; i++) {
                                createMarker(results[i]);
                            }
                        }

                    }

                    function createMarker(place) {
                        var placeLoc = place.geometry.location;
                        var marker = new google.maps.Marker({
                            map: map,
                            position: place.geometry.location,
                            icon: markerR

                        });



                        // Récupération des markers pour suppression au prochaine update

                            markersArray.push(marker);

                        google.maps.event.addListener(marker, 'click', function() {
                            infowindow.setContent(place.name);
                            infowindow.open(map, this);
                        });
                    }


                }

            },
            function( error ){
                console.log( "Something went wrong: ", error );
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            });



    }
});

