/**
 * Created by Dudu on 01/04/2016.
 */
homadeApp.controller('mapCtrl', ['$scope', 'uiGmapGoogleMapApi', function ($scope, uiGmapGoogleMapApi) {

    uiGmapGoogleMapApi.then(function(maps) {

        $scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };
        function getLatitudeLongitude(callback, address) {
            // If adress is not supplied, use default value 'Ferrol, Galicia, Spain'
            address = address || 'Ferrol, Galicia, Spain';
            // Initialize the Geocoder
            geocoder = new google.maps.Geocoder();
            if (geocoder) {
                geocoder.geocode({
                    'address': address
                }, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        callback(results[0]);
                    }
                });
            }
        }

        function setCenter(center){
            $scope.map.center = center;
        }

        getLatitudeLongitude(setCenter);

    });


}]);