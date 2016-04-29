/**
 * Created by Dudu on 04/04/2016.
 */
homadeApp.controller('resultCtrl', ['$scope', 'mealFactory', '$timeout', '$location', 'ezfb', 'uiGmapGoogleMapApi', function ($scope, mealFactory, $timeout, $location, ezfb, uiGmapGoogleMapApi) {

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
        $timeout(function() {
            console.log('center changed');
            $scope.map.center.latitude = position.coords.latitude;
            $scope.map.center.longitude = position.coords.longitude;
        },1000);
    }

    function addMarkers() {
        if (!mapIsReady) {
            $timeout(addMarkers,500);
            console.log('Map is not ready yet')
        }
        console.log('Map is ready')
        $scope.meals.forEach(function(element, index, array) {
            ezfb.api('/v2.6/' + element.chefFBId + '/picture?height=100&width=100', function (res) {
                element.chefPic = res.data.url;
            });
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
        $location.url('/OrderMeal/' + meal._id);
    };

    uiGmapGoogleMapApi.then(function(maps) {
        $scope.map = { center: { latitude: 32.1, longitude: 34.80 }, zoom: 14 };
        //---------Loading the user location -------------------
        navigator.geolocation.getCurrentPosition(showPosition);
        mapIsReady = true;
    });

}]);
