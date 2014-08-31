//Define an angular module for our app
var app = angular.module('mobile', ['ui-rangeSlider']);

app.controller('mobileController', function($scope, $http) {

    url_base = 'http://192.168.1.23/em_project';

    $scope.post = {};
    $scope.inscr = {};
    $scope.post.type = 'touristique';

    $scope.post.duree = {
        min: 4,
        max: 8
    };

    $scope.post.distance = {
        min: 4,
        max: 8
    };

    $scope.debbug = function() {
        console.log($scope.post);
    };

    $scope.search = function() {

        var postData = 'mySearch='+JSON.stringify($scope.post);

        $http({
            method : 'POST',
            url : url_base + '/ajax/search',
            data: postData,
            headers : {'Content-Type': 'application/x-www-form-urlencoded'}

        }).success(function(res){
            $scope.resultats = res;
        }).error(function(error){
            console.log(error);
        });
    };

    $scope.sigin = function() {
        $scope.inscr.travail = document.getElementById('travail').value;


        var geocoder = new google.maps.Geocoder();

        geocoder.geocode({
            "address": $scope.inscr.travail
        }, function(results, status) {

            if( status == google.maps.GeocoderStatus.OK ) {
                $scope.inscr.latlong = results[0].geometry.location.B + ', ' + results[0].geometry.location.k;

                var postData = 'myForm='+JSON.stringify($scope.inscr);

                $http({
                    method : 'POST',
                    url : url_base + '/ajax/inscription',
                    data: postData,
                    headers : {'Content-Type': 'application/x-www-form-urlencoded'}

                }).success(function(res){

                    $scope.error = res.error;

                    if($scope.error == 'inscrit'){
                        $scope.user.email = $scope.inscr.email;
                        $scope.user.ges = 0;
                        $(location).attr('href',"#home" );
                    }

                }).error(function(error){
                    console.log(error);
                });
            }
            else
            {
                $scope.error = 'adresse';
            }
        });



    };

    $scope.connection = function() {

        var postData = 'myForm='+JSON.stringify($scope.co);

        $http({
            method : 'POST',
            url : url_base + '/ajax/connection_mobile',
            data: postData,
            headers : {'Content-Type': 'application/x-www-form-urlencoded'}

        }).success(function(res){

            $scope.error = res.error;

            if(!$scope.error){

                $scope.user = {};
                $scope.user.email = res.email;
                $scope.user.ges = res.ges;
                $(location).attr('href',"#home" );
            }

        }).error(function(error){
            console.log(error);
        });



    };

});