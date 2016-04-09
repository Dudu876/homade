/**
 * Created by Dudu on 01/04/2016.
 */
homadeApp.controller('mapCtrl', ['$scope', 'uiGmapGoogleMapApi', '$log', function ($scope, uiGmapGoogleMapApi, $log) {

    uiGmapGoogleMapApi.then(function(maps) {

        //$scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };
        function getLatitudeLongitude(callback, address) {
            // If adress is not supplied, use default value 'Ferrol, Galicia, Spain'
            address = address || 'Ramat Gan 12, Spain';
            // Initialize the Geocoder
            geocoder = new maps.Geocoder();
            if (geocoder) {
                geocoder.geocode({
                    'address': address
                }, function (results, status) {
                    if (status == maps.GeocoderStatus.OK) {
                        callback(results[0]);
                    }
                });
            }
        }

        function setCenter(loc){
            $scope.map = { center: { latitude: loc.geometry.location.lat(), longitude: loc.geometry.location.lng() }, zoom: 8 };
        }

        getLatitudeLongitude(setCenter);

        $scope.marker = {
            id: 0,
            coords: {
                latitude: 32.062505962459944,
                longitude: 34.794884460449225
            },
            options: {
                draggable: true
            },
            events: {
                dragend: function (marker, eventName, args) {
                    $log.log('marker dragend');
                    var lat = marker.getPosition().lat();
                    var lng = marker.getPosition().lng();
                    $log.log(lat);
                    $log.log(lng);
                }
            },
            window: {
                title: 'this is title',
                options: {
                    visible: false
                },
                onClick: function() {
                    $scope.windowOptions.visible = !$scope.windowOptions.visible;
                },
                closeClick: function() {
                    $scope.windowOptions.visible = false;
                },
            }
        };

        $scope.polygons = [
            {
                id: 1,
                path: [
                    {
                        latitude: 32,
                        longitude: -32
                    }
                    //{
                    //    latitude: 20,
                    //    longitude: -95
                    //},
                    //{
                    //    latitude: 30,
                    //    longitude: -120
                    //},
                    //{
                    //    latitude: 40,
                    //    longitude: -105
                    //},
                    //{
                    //    latitude: 50,
                    //    longitude: -80
                    //}
                ],
                stroke: {
                    color: '#6060FB',
                    weight: 3
                },
                editable: false,
                draggable: false,
                geodesic: false,
                visible: true,
                fill: {
                    color: '#ff0000',
                    opacity: 0.3
                }
            }
        ];
    });
}]);