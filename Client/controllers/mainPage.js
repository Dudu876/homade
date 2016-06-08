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
    });

    navigator.geolocation.getCurrentPosition(setPosition);

    loadAllTags();

    $scope.onSelect = function(data) {
        if (data != null) {
            if (data.title != null) {
                $scope.search.query = data.title;
                $scope.go();
            }
        }
    };

    function loadAllTags() {
        mealFactory.getAllTags().success(function(tags) {
            $scope.tags = tags;
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

        if ($scope.search.query === undefined) return;
//         $scope.search.query = $scope.search.query.title;
        $rootScope.search = $scope.search;
        $rootScope.$broadcast('SEARCH',$scope.search);
        $location.url('/Result?q=' + $scope.search.query);
    };

}]);