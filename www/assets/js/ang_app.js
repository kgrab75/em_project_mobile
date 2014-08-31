//Define an angular module for our app
var app = angular.module('mobile', ['ui-rangeSlider']);

app.controller('mobileController', function($scope, $http, $timeout) {

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
            url : 'http://gomobility:8888/ajax/search',
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
        }, function(results) {
            $scope.inscr.latlong = results[0].geometry.location.B + ', ' + results[0].geometry.location.k;
        });

        var postData = 'myForm='+JSON.stringify($scope.inscr);

        $http({
            method : 'POST',
            url : 'http://gomobility:8888/ajax/inscription',
            data: postData,
            headers : {'Content-Type': 'application/x-www-form-urlencoded'}

        }).success(function(res){
            console.log('inscrit');
        }).error(function(error){
            console.log(error);
        });

    };

});