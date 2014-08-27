$(document).bind('pageinit', function(event) {

    var depart;


    var activePage = $(event.target);
    activePage = (activePage[0].id);
    console.log(activePage);

    // ************************ PAGE PARCOURS ************************

    if (activePage == "parcours") {

        console.log(depart);

        // CARTE GOOGLE MAP

        function initialize() {
            var mapOptions = {
                center: new google.maps.LatLng(-34.397, 150.644),
                zoom: 8
            };
            var map = new google.maps.Map(document.getElementById("map-canvas"),
                mapOptions);
        }
        google.maps.event.addDomListener(window, 'load', initialize);

        // FIN CARTE GOOGLE MAP

    }

if (activePage == "submit") {

        // RECUPERATION DES DONNES

        $('#submitParcours').on("tap", function(){
            depart = $('input:text[name=depart]').val();
            return depart;

        });


    }



});