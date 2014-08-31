$(document).bind('pageinit', function(event) {


    var  map, depart, transport, arrivee;


    var activePage = $(event.target);
    activePage = (activePage[0].id);
    console.log(activePage);



    // ************************ PAGE PARCOURS ************************

    if (activePage == "parcours") {



    }





    /* ********************************** PAGE PROPOSITION PARCOURS  ********************************** */

    if (activePage == "submit") {

        var options = {
            componentRestrictions: {country: 'fr'}
        };
        var input = document.getElementById('arrivee');
        autocomplete = new google.maps.places.Autocomplete(input, options);

    }

    if (activePage == "sigin") {

        var options = {
            componentRestrictions: {country: 'fr'}
        };
        var input = document.getElementById('travail');
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



});