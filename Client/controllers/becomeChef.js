/**
 * Created by Michael on 3/31/2016.
 */
homadeApp.controller('becomeChef', ['$scope', function ($scope) {
    $scope.isActive1 = true;
    $scope.isActive2 = false;
    $scope.isActive3 = false;
    $scope.locationChosen = false;

    autocomplete = new google.maps.places.Autocomplete(
        /** @type {!HTMLInputElement} */(document.getElementById('autocomplete')),
        {types: ['geocode']});

    google.maps.event.addListener(autocomplete, 'place_changed', function() {
        var place = autocomplete.getPlace();
        $scope.fromLat = place.geometry.location.lat();
        $scope.fromLng = place.geometry.location.lng();
        $scope.from = place.formatted_address;
        $scope.locationChosen = true;
        $scope.$apply();
    });

    $scope.setNext = function(){

        if ($scope.isActive1)
        {
            $scope.isActive1 = false;
            $scope.isActive2 = true;
        }
        else {
            $scope.isActive2 = false;
            $scope.isActive3 = true;
        }
    };

    $scope.setPrevious = function(){
        if ($scope.isActive2)
        {
            $scope.isActive1 = true;
            $scope.isActive2 = false;
        }
        else
        {
            $scope.isActive2 = true;
            $scope.isActive3 = false;
        }
    }
}]);