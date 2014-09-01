function getDataMap(res){
        console.log(res);

    var dataLast = res;


// *********** FONCTIONS GOOGLE MAPS ***********


// Initialise some variables
    var directionsService = new google.maps.DirectionsService();
    var num, map, data;
    var requestArray = [], renderArray = [];

    var loop = 0;
    var contentLoop="{";

    //MARKERS
    var imgD = 'assets/img/markerD.png';
    var imgA = 'assets/img/markerA.png';
    var infowindow = new google.maps.InfoWindow(), i;


    var locations = [];
    var limit;

    if( dataLast.length < 6){
        limit =  dataLast.length;
    }else {
        limit = 5;
    }


    for(i = 0; i < limit; i++){

        var start = dataLast[i].start;
        var splitStart = start.split(", ");
        var end = dataLast[i].arrival;
        var splitEnd = end.split(", ");

        locations.push([dataLast[i].titre, splitStart[0], splitStart[1], splitEnd[0], splitEnd[1], dataLast[i].id]);

    }


    while (loop < limit) {
        //console.log(dataLast[loop].titre);

        contentLoop += '"'+loop+'":';
        contentLoop+= '["'+dataLast[loop].start+'" , "'+dataLast[loop].arrival+'"]';
        //contentLoop+= '["'+dataLast[loop].start+'" , "'+dataLast[loop].arrival+'" , "'+dataLast[loop].transport+'" , "'+dataLast[loop].id+'"]';
        if(loop<limit-1){
            contentLoop += ",";
        }else {
            contentLoop += "}";
        }
        loop++;
    }

    var jsonArray = JSON.parse(contentLoop);


    // 16 Standard Colours for navigation polylines
    var colourArray = ['#33A0D4', 'grey', 'fuchsia', 'black', 'white', 'lime', 'maroon', 'purple', 'aqua', 'red', 'green', 'silver', 'olive', 'blue', 'yellow', 'teal'];

    // Let's make an array of requests which will become individual polylines on the map.
    function generateRequests(){



        requestArray = [];

        for (var route in jsonArray){
            // This now deals with one of the people / routes

            // Somewhere to store the wayoints
            var waypts = [];

            // 'start' and 'finish' will be the routes origin and destination
            var start, finish;

            // lastpoint is used to ensure that duplicate waypoints are stripped
            var lastpoint;

            data = jsonArray[route];

            limit = data.length;

            for (var waypoint = 0; waypoint < limit; waypoint++) {
                if (data[waypoint] === lastpoint){
                    // Duplicate of of the last waypoint - don't bother
                    continue;
                }

                // Prepare the lastpoint for the next loop
                lastpoint = data[waypoint]

                // Add this to waypoint to the array for making the request
                waypts.push({
                    location: data[waypoint],
                    stopover: true
                });
            }

            // Grab the first waypoint for the 'start' location
            start = (waypts.shift()).location;
            // Grab the last waypoint for use as a 'finish' location
            finish = waypts.pop();
            if(finish === undefined){
                // Unless there was no finish location for some reason?
                finish = start;
            } else {
                finish = finish.location;
            }

            // Let's create the Google Maps request object
            var request = {
                origin: start,
                destination: finish,
                waypoints: waypts,
                travelMode: google.maps.TravelMode.DRIVING
            };

            // and save it in our requestArray
            requestArray.push({"route": route, "request": request});
            console.log(request);
            console.log(requestArray);



        }

        processRequests();
    }

    function processRequests(){

        // Counter to track request submission and process one at a time;
        var i = 0;


        // Used to submit the request 'i'
        function submitRequest(){
            directionsService.route(requestArray[i].request, directionResults);
        }

        // Used as callback for the above request for current 'i'
        function directionResults(result, status) {
            if (status == google.maps.DirectionsStatus.OK) {

                // Create a unique DirectionsRenderer 'i'
                renderArray[i] = new google.maps.DirectionsRenderer({suppressMarkers: true});
                renderArray[i].setMap(map);


                var img = 'assets/images/marker.png';


                // Some unique options from the colorArray so we can see the routes
                renderArray[i].setOptions({
                    preserveViewport: true,
                    suppressInfoWindows: true,
                    polylineOptions: {
                        strokeWeight: 4,
                        strokeOpacity: 0.8,
                        strokeColor: colourArray[0]
                    }

                });


                // Use this new renderer with the result
                renderArray[i].setDirections(result);
                // and start the next request

                nextRequest();
            }

        }

        function nextRequest(){
            // Increase the counter
            i++;
            // Make sure we are still waiting for a request
            if(i >= requestArray.length){
                // No more to do
                return;
            }
            // Submit another request
            submitRequest();
        }

        // This request is just to kick start the whole process
        submitRequest();
    }

    // Called Onload
    function init() {

        // Some basic map setup (from the API docs)
        var mapOptions = {
            center: new google.maps.LatLng(48.861618, 2.347065),
            zoom: 10,
            mapTypeControl: false,
            streetViewControl: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        map = new google.maps.Map(document.getElementById('mapDetails'), mapOptions);




        // Start the request making
        generateRequests()
        setMarker();


    }

    function setMarker()  {

        var i;

        for (i = 0; i < locations.length; i++) {


            markerStart = new google.maps.Marker({
                position: new google.maps.LatLng(locations[i][1] , locations[i][2]),
                icon:imgD,
                title:locations[i][0],
                map: map
            });

            google.maps.event.addListener(markerStart, 'click', (function(markerStart, i) {
                return function() {
                    infowindow.setContent("Arrivée parcours :" + (i + 1));
                    infowindow.open(map, markerStart);
                }
            })(markerStart, i));


            markerEnd = new google.maps.Marker({
                position: new google.maps.LatLng(locations[i][3] , locations[i][4]),
                icon:imgA,
                title:locations[i][0],
                map: map
            });
            google.maps.event.addListener(markerEnd, 'click', (function(markerEnd, i) {
                return function() {
                    infowindow.setContent("Arrivée parcours :" + (i + 1));
                    infowindow.open(map, markerEnd);
                }
            })(markerEnd, i));
        }

    }

    init();

    // *********** FIN FONCTIONS GOOGLE MAPS ***********


}

