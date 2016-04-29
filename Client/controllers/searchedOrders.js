/**
 * Created by Dudu on 04/04/2016.
 */
homadeApp.controller('resultCtrl', ['$scope', 'mealFactory', '$timeout', '$location', 'uiGmapGoogleMapApi', function ($scope, mealFactory, $timeout, $location, uiGmapGoogleMapApi) {

    //$scope.meals = meals;
    var i = 100;
    var mapIsReady = false;

    mealFactory.get().success(function (response) {
        $scope.meals = response;
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

    $scope.mealClicked = function(meal) {
        mealFactory.setSelected(meal);
        $location.url('/OrderMeal/' + meal._id);
    };

    uiGmapGoogleMapApi.then(function(maps) {
        //---------Loading the user location -------------------
        navigator.geolocation.getCurrentPosition(showPosition);
        $scope.map = { center: { latitude: 32.1, longitude: 34.80 }, zoom: 14 };
        mapIsReady = true;
    });

}]);
