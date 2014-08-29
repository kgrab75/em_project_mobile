$(document).bind('pageinit', function(event) {

    var  map, depart, transport, arrivee;


    var activePage = $(event.target);
    activePage = (activePage[0].id);
    console.log(activePage);





    // ************************ PAGE PARCOURS ************************

    if (activePage == "parcours") {


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