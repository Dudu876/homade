/**
 * Created by Michael on 3/16/2016.
 */
homadeApp.controller('mainPageCtrl', ['$scope', '$rootScope', '$location', 'mealFactory', function ($scope, $rootScope, $location, mealFactory) {

    $scope.search = {};
    $scope.tags = [];

    autocomplete = new google.maps.places.Autocomplete(
        /** @type {!HTMLInputElement} */(document.getElementById('autocomplete')),
        {types: ['address']});

    google.maps.event.addListener(autocomplete, 'place_changed', function() {
        var place = autocomplete.getPlace();
        $scope.search.latlng = [place.geometry.location.lng(), place.geometry.location.lat()];
        console.log($scope.search.latlng);
    });

    navigator.geolocation.getCurrentPosition(setPosition);

    loadAllTags();

    function onSelect(data) {
        console.log(data);
    }

    function loadAllTags() {
        mealFactory.getAllTags().success(function(tags) {
            $scope.tags = tags;
            console.log('tags loaded!');
            //var elem = (angular.element( document.querySelector( '#query' ) ))[0];
            //elem.autocomplete = {
            //    source: $scope.tags,
            //    //minLength: 2,
            //    select: onSelect
            //};
        });
    }

    function setPosition(position) {
        geocoder = new google.maps.Geocoder();
        var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        geocoder.geocode({'latLng': latlng}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                console.log(results);
                if (results[1]) {
                    //formatted address
                    $scope.search.location = results[0].formatted_address;
                    $scope.search.latlng = results[0].geometry.location;
                }
            }
        });
    }

    $scope.go = function() {
        $rootScope.search = $scope.search;
        $rootScope.$broadcast('SEARCH',$scope.search);
        $location.url('/Result?q=' + $scope.search.query);
    };

}]);