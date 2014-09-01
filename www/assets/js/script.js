

$(document).bind('pageinit', function(event) {




    function timeConvertion(tpsMin){
        var dureeH = Math.floor(tpsMin / 60);
        var dureeM = tpsMin % 60;

        if(dureeH !==0){
            if(dureeM < 10){
                dureeHM = dureeH + "h0" + dureeM ;
            }else {
                dureeHM = dureeH + "h" + dureeM ;
            }

        } else {
            dureeHM = dureeM + "m";
        }

        return dureeHM;
    }

    function totalGes(totalKm){
        var GES = totalKm * 69.81;

        if(GES < 1000) {
            GES = Math.round(GES*100)/100;
            gesContent = GES + ' g';
        } else {
            GES = GES /1000;
            GES = Math.round(GES*100)/100;
            gesContent = GES + ' kg';
        }

        return gesContent;
    }



    var input, options, coord_arrivee, startMarker, arrivalMarker;


    var activePage = $(event.target);
    activePage = (activePage[0].id);
    console.log(activePage);



    // ************************ PAGE PARCOURS ************************

    if (activePage == "parcours") {



    }





    /* ********************************** PAGE PROPOSITION PARCOURS  ********************************** */

    if (activePage == "submit" || activePage == "submit&ui-state=dialog") {

        options = {
            componentRestrictions: {country: 'fr'}
        };
        input = document.getElementById('arrivee');
        autocomplete = new google.maps.places.Autocomplete(input, options);


        // STOP GEOLOCATION
        navigator.geolocation.clearWatch(positionTimer);

    }

    if (activePage == "sigin") {

        options = {
            componentRestrictions: {country: 'fr'}
        };
        input = document.getElementById('travail');
        autocomplete = new google.maps.places.Autocomplete(input, options);

    }




    /*  ********************************** PAGE RECHERCHE TOURISTIQUE  ********************************** */


    if (activePage == "searchTourisme") {

        $("input:radio[name=typeParcours]").on("change", function(){

            var value = $("input:radio[name=typeParcours]:checked").val();

            if( value === "touristique" ){
                $.mobile.changePage('#searchTourisme');
            }
            if( value === "sportif" ){
                $.mobile.changePage('#searchSport');
            }
            if( value === "work" ){
                $.mobile.changePage('#searchWork');
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






    /*  ********************************** PAGE BILAN SUBMIT WORK  ********************************** */


    if (activePage == "bilanSubmit" || activePage == "#bilanSubmit&ui-state=dialog") {

        // STOP GEOLOCATION
        navigator.geolocation.clearWatch(positionTimer);


        // RECUPERATION DES DONNES DU PARCOURS

        $(document).on('pageshow', '#bilanSubmit', function (event) {

            console.log("Temps parcours : " + timer);
            console.log("Distance : " + distanceTotal);
            console.log("DEPART : ");
            console.log(origin);
            console.log("ARRIVEE : ");
            console.log(arrivee);
            console.log(transport);
            console.log("Temps google : " + googleTime);



            /// ********************************* REQUETE GOOGLE MAP *********************************
            var directionsBilan;
            var directionsServiceBilan = new google.maps.DirectionsService();
            var mapBilan;

            function initialize() {

                directionsBilan = new google.maps.DirectionsRenderer();
                var chicago = new google.maps.LatLng(48.877547, 2.357875);
                var mapOptions = {
                    zoom:7,
                    center: chicago
                };
                mapBilan = new google.maps.Map(document.getElementById('map-bilanS'), mapOptions);
                directionsBilan.setMap(mapBilan);

                var request = {
                    origin:origin,
                    destination:arrivee,
                    travelMode: google.maps.TravelMode[transport]
                };
                directionsServiceBilan.route(request, function(response, status) {
                    if (status == google.maps.DirectionsStatus.OK) {
                        directionsBilan.setDirections(response);
                    }
                });

                var geocoder = new google.maps.Geocoder();

                geocoder.geocode({
                    "address": arrivee
                }, function(results, status) {

                    if( status == google.maps.GeocoderStatus.OK ) {
                        coord_arrivee = results[0].geometry.location.B + ', ' + results[0].geometry.location.k;
                    }
                    else
                    {
                        console.log('erreur dans l\'adresse');
                    }
                });

            }

            initialize();



            /// ********************************* FIN REQUETE GOOGLE MAP *********************************

            googleTimeM = Math.round(googleTime / 60);
            googleTimeHM = timeConvertion(googleTimeM);

            timerM = Math.round(timer / 60);
            timerHM = timeConvertion(timerM);

            // TOTAL MIS AU FORMAT KM
            var distanceKm = distanceM / 1000.0;
            var ges = totalGes(distanceKm);



            // CALCUL CALORIES (ref : 2,5Kcal/min)
            var cal = timerM * 2.5;


            $("#bilanSearchT").html("<i class='fa fa-clock-o fa-2x'></i> " + timerHM + "<br><span style='font-size: 0.8em;'>Temps prévu : " + googleTimeHM + "</span>");
            $("#bilanSearchKm").html("<i class='fa fa-location-arrow fa-2x'></i> " + distanceTotal);
            $("#bilanSearchGes").html("<i class='fa fa-recycle fa-2x'></i> " + ges + " CO<sup>2</sup>");
            $("#bilanSearchCal").html("<i class='fa fa-tachometer fa-2x'></i> " + cal + " Kcal");

            bilan = {
                'start' : origin.k + ', ' + origin.B,
                'arrival' : locationPlace.k + ', ' + locationPlace.B,
                'ges' : distanceKm * 69.81,
                'distance' : distanceM,
                'transport' : transport,
                'difficulty' : 1,
                'sous_type' : document.getElementById('typeParcours').value,
                'payant' : 0,
                'duree' : googleTime/60

            }

            localStorage.setItem('bilan', JSON.stringify(bilan));

        });


    }



});