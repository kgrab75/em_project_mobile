$(document).bind('pageinit', function(event) {

    var  map, depart, transport, arrivee;


    var activePage = $(event.target);
    activePage = (activePage[0].id);
    console.log(activePage);

    // ************************ PAGE PARCOURS ************************

    if (activePage == "parcours") {

        // RECUPERATION DES DONNEES SAISIE POUR LA PAGE PRECEDENTE
        $(document).on('pagebeforeshow', '#parcours', function(e, data){
            arrivee = data.prevPage.find('input:text[name=arrivee]').val();
            transport = data.prevPage.find('input:radio[name=transport]:checked').val();
            console.log(transport);
            console.log(arrivee);


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
                            mapTypeId: google.maps.MapTypeId.ROADMAP
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




        $(document).on('pageshow', '#parcours', function(){
            var content_width = $.mobile.activePage.find("div#map-canvas:visible:visible").outerWidth();
            $('#map-canvas').css({'height':content_width});

        });



    }





    /* ********************************** PAGE PROPOSITION PARCOURS  ********************************** */

    if (activePage == "submit") {

        var options = {
            componentRestrictions: {country: 'fr'}
        };
        var input = document.getElementById('arrivee');
        autocomplete = new google.maps.places.Autocomplete(input, options);

    }




    /*  ********************************** PAGE RECHERCHE TOURISTIQUE  ********************************** */


    if (activePage == "searchTourisme") {

        $("#tourismeMenu input:radio[name=typeParcoursT]").on("change", function(){

            var value = $("#tourismeMenu input:radio[name=typeParcoursT]:checked").val();

            if( value === "sport" ){
                document.location.href="#searchSport";
            }
            if( value === "work" ){
                document.location.href="#searchWork";
            }


        });

    }





    /*  ********************************** PAGE RECHERCHE SPORT  ********************************** */


    if (activePage == "searchSport") {

        $("#sportMenu input:radio[name=typeParcoursS]").on("change", function(){

            var value = $("#sportMenu input:radio[name=typeParcoursS]:checked").val();

            if( value === "tourisme" ){
                document.location.href="#searchTourisme";
            }
            if( value === "work" ){
                document.location.href="#searchWork";
            }


        });

    }





    /*  ********************************** PAGE RECHERCHE WORK  ********************************** */


    if (activePage == "searchWork") {

        $("#workMenu input:radio[name=typeParcoursW]").on("change", function(){

            var value = $("#workMenu input:radio[name=typeParcoursW]:checked").val();

            if( value === "tourisme" ){
                document.location.href="#searchTourisme";
            }
            if( value === "sport" ){
                document.location.href="#searchSport";
            }


        });

    }



});