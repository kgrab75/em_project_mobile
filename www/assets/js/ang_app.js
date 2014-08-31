//Define an angular module for our app
var app = angular.module('mobile', ['ui-rangeSlider']);

app.controller('mobileController', function($scope, $http, $timeout) {

    $scope.post = {};
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

});