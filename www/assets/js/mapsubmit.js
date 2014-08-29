var watchID = null;
var markerLocation = null;
var arrivee = null;


$(document).on('pagebeforeshow', '#parcours', function(e, data){


    arrivee = data.prevPage.find('input:text[name=arrivee]').val();
    transport = data.prevPage.find('input:radio[name=transport]:checked').val();
    typeParcours = data.prevPage.find('#typeParcours option:selected').val();



    if (typeParcours === "nature"){
        mapType = "TERRAIN";
    } else {
        mapType = "ROADMAP";
    }



    var optn = {
        enableHighAccuracy: true,
        timeout: 3000,
        maximumAge: 0
    };
    if( navigator.geolocation )
        navigator.geolocation.watchPosition(success, fail, optn);
    else
        $("p").html("HTML5 Not Supported");

    // STOP WATCH POSITION
    /*
    $("button").click(function(){

        if(watchID)
            navigator.geolocation.clearWatch(watchID);

        watchID = null;
        return false;
    });
    */


    function success(position)
    {

        var googleLatLng = new google.maps.LatLng(position.coords.latitude,
            position.coords.longitude);
        var mapOtn={
            zoom:10,
            center:googleLatLng,
            mapTypeId:google.maps.MapTypeId.ROAD
        };

        var Pmap=document.getElementById("map-canvas");

        map = new google.maps.Map(Pmap, mapOtn);

        markerLocation = "assets/img/location.png";
        addMarker(map, googleLatLng, "Votre position", markerLocation);


    // PARCOURS GOOGLE MAP

        // REQUETE GOOGLE MAPS

        var directionsService = new google.maps.DirectionsService(),
            directionsDisplay = new google.maps.DirectionsRenderer();

            travel = {
                        origin : googleLatLng,
                        destination : arrivee,
                        travelMode : google.maps.DirectionsTravelMode[transport]

                    }

                //map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);


                directionsDisplay.setMap(map);
                //$("#map-directions").empty();

                //directionsDisplay.setPanel(document.getElementById("map-directions"));

                directionsService.route(travel, function(result, status) {
                    if (status === google.maps.DirectionsStatus.OK) {
                        directionsDisplay.setDirections(result);

                        var distanceDirection = result.routes[0].legs[0].steps[0].distance.text;
                        var iconDirection = result.routes[0].legs[0].steps[0].maneuver;
                        var distanceTotal = result.routes[0].legs[0].distance.text;


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
                        $("#distParcours").html("<p><i class='fa fa-location-arrow fa-lg'></i> " + distanceTotal + "</p>");
                    }




                    // REQUETE AFFICHAGE POINTS STRATEGIQUES

                    var endLocation = new google.maps.LatLng(result.routes[0].legs[0].end_location.k, result.routes[0].legs[0].end_location.B);

                    /*
                     // Récupération de la distance du trajet radius autour de l'arrivée
                     var distanceRadius = result.routes[0].legs[0].distance.value;
                     // Si la distance du trajet est supérieur à 10 km on fait un radius de 10 km autour du point d'arrivée
                     if(distanceRadius > 5000) { distanceRadius = 5000; }
                     */


                    console.log(typeParcours);

                    if(typeParcours === "gastronomique") {

                        var requestPlace = {
                            location:  endLocation,
                            radius: 2000,
                            types: ['restaurant']
                        };

                        var markerImg = "assets/img/markerR.png";
                        showPlaces();
                    }




                    // AFFICHAGE DES POINTS D'INTERETS

                    function showPlaces() {


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
                                icon: markerImg
                            });

                            google.maps.event.addListener(marker, 'click', function() {
                                infowindow.setContent(place.name);
                                infowindow.open(map, this);
                            });
                        }
                    }



                });










    }

    function addMarker(map, googleLatLng, title, icon){
        var markerOptn={
            position:googleLatLng,
            map:map,
            title:title,
            animation:google.maps.Animation.DROP,
            icon:icon
        };
        var marker = new google.maps.Marker(markerOptn);

    }

    function fail(error)
    {
        var errorType={
            0:"Unknown Error",
            1:"Permission denied by the user",
            2:"Position of the user not available",
            3:"Request timed out"
        };

        var errMsg = errorType[error.code];

        if(error.code == 0 || error.code == 2){
            errMsg = errMsg+" - "+error.message;
        }

        console.log(errMsg);
    }

});


/*var infowindow;
var markerImg = "";
var mapType;

// / RECUPERATION DES DONNEES SAISIE POUR LA PAGE PRECEDENTE
$(document).on('pagebeforeshow', '#parcours', function(e, data){
    arrivee = data.prevPage.find('input:text[name=arrivee]').val();
    transport = data.prevPage.find('input:radio[name=transport]:checked').val();
    typeParcours = data.prevPage.find('#typeParcours option:selected').val();
     if (typeParcours === "nature"){
         mapType = "TERRAIN";
     } else {
         mapType = "ROADMAP";
     }



    // REQUETE GOOGLE MAPS

    var directionsService = new google.maps.DirectionsService(),
        directionsDisplay = new google.maps.DirectionsRenderer(),
        createMap = function (start) {
            var travel = {
                    origin : (start.coords)? new google.maps.LatLng(start.lat, start.lng) : start.address,
                    destination : arrivee,
                    travelMode : google.maps.DirectionsTravelMode[transport]

                },
                mapOptions = {
                    zoom: 10,
                    center : new google.maps.LatLng(44.8152705,4.3737854),
                    mapTypeId: google.maps.MapTypeId[mapType]
                };

            map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);


            directionsDisplay.setMap(map);
            $("#map-directions").empty();

            directionsDisplay.setPanel(document.getElementById("map-directions"));
            directionsService.route(travel, function(result, status) {
                if (status === google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(result);

                    var distanceDirection = result.routes[0].legs[0].steps[0].distance.text;
                    var iconDirection = result.routes[0].legs[0].steps[0].maneuver;
                    var distanceTotal = result.routes[0].legs[0].distance.text;


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
                    $("#distParcours").html("<p><i class='fa fa-location-arrow fa-lg'></i> " + distanceTotal + "</p>");
                }




                // REQUETE AFFICHAGE POINTS STRATEGIQUES

                var endLocation = new google.maps.LatLng(result.routes[0].legs[0].end_location.k, result.routes[0].legs[0].end_location.B);
*/
                /*
                // Récupération de la distance du trajet radius autour de l'arrivée
                var distanceRadius = result.routes[0].legs[0].distance.value;
                // Si la distance du trajet est supérieur à 10 km on fait un radius de 10 km autour du point d'arrivée
                if(distanceRadius > 5000) { distanceRadius = 5000; }
                */

/*
                console.log(typeParcours);

                if(typeParcours === "gastronomique") {

                    var requestPlace = {
                        location:  endLocation,
                        radius: 2000,
                        types: ['restaurant']
                    };

                    var markerImg = "assets/img/markerR.png";
                    showPlaces();
                }


                if(typeParcours === "gastronomique") {

                    var requestPlace = {
                        location:  endLocation,
                        radius: 2000,
                        types: ['restaurant']
                    };

                    var markerImg = "assets/img/markerR.png";
                    showPlaces();
                }



                // AFFICHAGE DES POINTS D'INTERETS

                function showPlaces() {


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
                             icon: markerImg
                         });

                         google.maps.event.addListener(marker, 'click', function() {
                             infowindow.setContent(place.name);
                             infowindow.open(map, this);
                         });
                     }
                 }



            });
        };

    // Check geolocation support
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
                // Success!
                createMap({
                    coords : true,
                    lat : position.coords.latitude,
                    lng : position.coords.longitude
                });
            },
            function () {
                // En cas d'erreur centre sur l'archèche
                createMap({
                    coords : false,
                    address : "Ardèche, France"
                });
            }
        );
    }
    else {

        createMap({
            coords : false,
            address : "Ardèche, France"
        });
    }


});

    /*

var infowindow;
var markerR = "assets/img/markerR.png"

function initialize() {
    var ardeche = new google.maps.LatLng(48.862812, 2.342597);

    map = new google.maps.Map(document.getElementById('map-canvas'), {
        center: ardeche,
        zoom: 15,

    });

    var requestPlace = {
        location: ardeche,
        radius: 10000,
        types: ['restaurant']
    };
    infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch(requestPlace, callback);
}

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

    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(place.name);
        infowindow.open(map, this);
    });
}

google.maps.event.addDomListener(window, 'load', initialize);

*/