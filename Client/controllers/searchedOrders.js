/**
 * Created by Dudu on 04/04/2016.
 */
homadeApp.controller('resultCtrl', ['$scope', 'mealService', '$timeout', 'uiGmapGoogleMapApi', function ($scope, mealService, $timeout, uiGmapGoogleMapApi) {

    //$scope.meals = meals;
    var i = 100;
    var mapIsReady = false;

    mealService.get().then(function (response) {
        $scope.meals = response.data;
        addMarkers();
    });

    //---------Loading the user location -------------------
    $scope.markers = [];

    function showPosition(position) {
        console.log(position);
        $scope.map.center.latitude = position.coords.latitude;
        $scope.map.center.longitude = position.coords.longitude;
    }

    function addMarkers() {
        if (!mapIsReady) {
            $timeout(addMarkers,500);
            console.log('Map is not ready yet')
        }
        console.log('Map is ready')
        $scope.meals.forEach(function(element, index, array) {
            var marker = {
                id: index,
                coords: {
                    //latitude: element.location.lat,
                    //longitude: element.location.lng
                    latitude: $scope.meals[0].chef.location.coordinates[0],
                    longitude: $scope.meals[0].chef.location.coordinates[1]
                },
                options: {
                },
                events: {
                },
                window: {
                    title: element.name,
                    options: {
                        visible: true
                    },
                    onClick: function(window) {
                        window.options.visible = !window.options.visible;
                    },
                    closeClick: function(window) {
                        window.options.visible = false;
                    }
                }
            };
            $scope.markers.push(marker);
        });
    }

    uiGmapGoogleMapApi.then(function(maps) {
        //---------Loading the user location -------------------
        navigator.geolocation.getCurrentPosition(showPosition);
        $scope.map = { center: { latitude: 32.1, longitude: 34.80 }, zoom: 14 };

        mapIsReady = true;


        //var mark = {
        //    id: 500,
        //    coords: {
        //        latitude: 32.062505962459944,
        //        longitude: 34.794884460449225
        //    },
        //    options: {
        //        draggable: true
        //    },
        //    events: {
        //        dragend: function (marker, eventName, args) {
        //            console.log('marker dragend1');
        //            var lat = marker.getPosition().lat();
        //            var lng = marker.getPosition().lng();
        //            console.log(lat);
        //            console.log(lng);
        //        }
        //    },
        //    window: {
        //        title: 'this is title',
        //        options: {
        //            visible: false
        //        },
        //        onClick: function() {
        //            $scope.window.options.visible = !$scope.window.options.visible;
        //        },
        //        closeClick: function() {
        //            $scope.window.options.visible = false;
        //        }
        //    }
        //};
        //$scope.markers.push(mark);

    });

}]);
