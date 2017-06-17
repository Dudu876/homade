/**
 * Created by Dudu on 04/04/2016.
 */
homadeApp.controller('resultCtrl', ['$scope', '$rootScope', 'mealFactory', '$timeout', '$location', '$routeParams', 'ezfb', 'uiGmapGoogleMapApi', 'spinnerService', function($scope, $rootScope, mealFactory, $timeout, $location, $routeParams, ezfb, uiGmapGoogleMapApi, spinnerService) {

    //$scope.meals = meals;
    var i = 100;
    var mapIsReady = false;

    //console.log('this is the route params' +  $routeParams.q); *********WORKING

    if ($rootScope.search.query === undefined) {
        $rootScope.search = {
            'query': $routeParams.q
        };
    }

    $rootScope.loading = 0;
    // $rootScope.loading++;
    $rootScope.loading++;

    mealFactory.getFiltered($rootScope.search).success(function(response) {
        $scope.meals = response;
        addMarkers();
    });

    //---------Loading the user location -------------------
    $scope.markers = [];

    function showPosition(position) {
        $timeout(function() {
            $scope.map.center.latitude = position.coords.latitude;
            $scope.map.center.longitude = position.coords.longitude;
            $scope.markers.push({
                id: 0,
                coords: {
                    longitude: position.coords.longitude,
                    latitude: position.coords.latitude
                },
                options: {
                    icon: '../public/images/markers/green-dot.png'
                },
                window: {
                    title: "Me",
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
            });
            // $rootScope.loading--;
        }, 1000);
    }

    function addMarkers() {
        if (!mapIsReady) {
            $timeout(addMarkers, 500);
            console.log('Map is not ready yet')
        }
        console.log('Map is ready');
        $scope.meals.forEach(function(element, index, array) {
            ezfb.api('/' + element.chefFBId + '/picture?height=100&width=100', function(res) {
                if (!res.error) {
                    element.chefPic = res.data.url;
                } else {
                    element.chefPic = "../public/images/BlankPicture.png";
                }
            });
            var marker = {
                id: index + 1,
                coords: {
                    //latitude: element.location.lat,
                    //longitude: element.location.lng
                    longitude: element.chef.location.coordinates[0],
                    latitude: element.chef.location.coordinates[1]
                },
                options: {
                    icon: '../public/images/markers/red-dot.png'
                },
                events: {
                    mouseover: function() {},
                    mouseout: function() {}
                },
                //control: $scope.mapControl[index+1],
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
            //$scope.markers[index].myControl = {};
            //$scope.markers[index].control = $scope.markers[index].myControl;
        });
        //spinner
        //spinnerService.hide('mainSpinner');
        $rootScope.loading--;
    }

    $scope.mealClicked = function(meal) {
        $location.url('/OrderMeal/' + meal._id);
    };

    $scope.mealOver = function(meal) {
        console.log($scope.mapControl);
    };

    uiGmapGoogleMapApi.then(function(maps) {
        $scope.map = { center: { latitude: 32.1, longitude: 34.80 }, zoom: 14 };
        //---------Loading the user location -------------------
        navigator.geolocation.getCurrentPosition(showPosition);
        mapIsReady = true;
    });

}]);