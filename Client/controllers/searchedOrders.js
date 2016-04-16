/**
 * Created by Dudu on 04/04/2016.
 */
homadeApp.controller('resultCtrl', ['$scope', 'uiGmapGoogleMapApi', function ($scope, uiGmapGoogleMapApi) {

    //---------Loading the result data from server--------------
    var meals = [
        { name: 'Kebab', description: 'The best Kebab in the country', location:{lat:32.1,lng:34.7}, price: 200,
            tags: ['best','meal','ever','kebab'],type:'meat',kosher: true,glutenfree: false},
        { name: 'Kebab', description: 'The best Kebab in the country', location:{lat:32.1,lng:34.1}, price: 200,
            tags: ['best','meal','ever','kebab'],type:'meat',kosher: true,glutenfree: false},
        { name: 'Kebab', description: 'The best Kebab in the country', location:{lat:32.1,lng:34.6}, price: 200,
            tags: ['best','meal','ever','kebab'],type:'meat',kosher: true,glutenfree: false},
        { name: 'Kebab', description: 'The best Kebab in the country', location:{lat:32.1,lng:34.2}, price: 200,
            tags: ['best','meal','ever','kebab'],type:'meat',kosher: true,glutenfree: false},
        { name: 'Kebab', description: 'The best Kebab in the country', location:{lat:32.1,lng:34.3}, price: 200,
            tags: ['best','meal','ever','kebab'],type:'meat',kosher: true,glutenfree: false},
        { name: 'Kebab', description: 'The best Kebab in the country', location:{lat:32.1,lng:34.4}, price: 200,
            tags: ['best','meal','ever','kebab'],type:'meat',kosher: true,glutenfree: false},
        { name: 'Kebab', description: 'The best Kebab in the country', location:{lat:32.1,lng:34.5}, price: 200,
            tags: ['best','meal','ever','kebab'],type:'meat',kosher: true,glutenfree: false},
        { name: 'Kebab', description: 'The best Kebab in the country', location:{lat:32.1,lng:34.6}, price: 200,
            tags: ['best','meal','ever','kebab'],type:'meat',kosher: true,glutenfree: false}
    ];


    $scope.meals = meals;
    var i = 100;

    //---------Loading the user location -------------------
    $scope.markers = [];

    uiGmapGoogleMapApi.then(function(maps) {
        //---------Loading the user location -------------------
        $scope.map = { center: { latitude: 32.8, longitude: 34.2 }, zoom: 8 };

        meals.forEach(function(element, index, array) {
            var marker = {
                id: index,
                coords: {
                    latitude: element.location.lat,
                    longitude: element.location.lng
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
