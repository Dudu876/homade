/**
 * Created by Michael on 3/31/2016.
 */
homadeApp.controller('becomeChef', ['$scope', 'locationTipsFactory', 'chefsFactory', 'userFactory', 'uiGmapIsReady', '$http', function ($scope, locationTipsFactory, chefsFactory, userFactory, uiGmapGoogleMapApi, $http) {
    $scope.isActive1 = true;
    $scope.isActive2 = false;
    $scope.locationChosen = false;
    $scope.isEdit = false;
    $scope.showMap = false;
    $scope.markerOptions = { draggable: true };
    $scope.events = {
        dragend: function () {
            //UpdatePlace($scope.chefDetails.location[0], $scope.chefDetails.location[1], $scope.chefDetails.locationName);
            var qs = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + $scope.chefDetails.location[1] + "," + $scope.chefDetails.location[0] +"&sensor=false&key=AIzaSyDpkTgTR--qces2l4LuT35p1todOQcimJg";
            $http.get(qs).then(function(response) {
                UpdatePlace($scope.chefDetails.location[0], $scope.chefDetails.location[1], response.data.results[0].formatted_address);
                document.getElementById('autocomplete').placeholder = $scope.chefDetails.locationName;
            })
        }
    };

    $scope.init = function(){
        $scope.chefDetails.fbId = userFactory.fbId;
        $scope.chefDetails.name = userFactory.fullname;

        if(userFactory.isChef){
            $scope.isEdit = true;
            chefsFactory.get($scope.chefDetails.fbId).success(function(data){
                $scope.chefDetails = data;
                document.getElementById('autocomplete').placeholder = $scope.chefDetails.locationName;
                $scope.chefDetails.workDays[0].dayName = 'Sunday';
                $scope.chefDetails.workDays[1].dayName = 'Monday';
                $scope.chefDetails.workDays[2].dayName = 'Tuesday';
                $scope.chefDetails.workDays[3].dayName = 'Wedenesday';
                $scope.chefDetails.workDays[4].dayName = 'Thursday';
                $scope.chefDetails.workDays[5].dayName = 'Friday';
                $scope.chefDetails.workDays[6].dayName = 'Saturday';

                UpdatePlace($scope.chefDetails.location.coordinates[0], $scope.chefDetails.location.coordinates[1], $scope.chefDetails.locationName);
            });
        }
        else
        {
            var startingTime = new Date();
            startingTime.setHours(8);
            startingTime.setMinutes(0);

            var finishTime = new Date();
            finishTime.setHours(20);
            finishTime.setMinutes(0);

            $scope.chefDetails.workDays = [
                { day: 1, dayName: 'Sunday', isWorking:true, startingTime: startingTime, finishTime: finishTime },
                { day: 2, dayName: 'Monday', isWorking:true, startingTime: startingTime, finishTime: finishTime },
                { day: 3, dayName: 'Tuesday', isWorking:true, startingTime: startingTime, finishTime: finishTime },
                { day: 4, dayName: 'Wedenesday', isWorking:true, startingTime: startingTime, finishTime: finishTime },
                { day: 5, dayName: 'Thursday', isWorking:true, startingTime: startingTime, finishTime: finishTime },
                { day: 6, dayName: 'Friday', isWorking:true, startingTime: startingTime, finishTime: finishTime },
                { day: 7, dayName: 'Saturday', isWorking:true, startingTime: startingTime, finishTime: finishTime }
            ];
        }

    };

    $scope.chefDetails = {};
    $scope.chefDetails.location = {latitude: 32, longitude: 35};

    if (userFactory.fbId != "") {
        $scope.init();
    }
    else {
        $scope.$on('isChefUpdate', function (event, args) {
            $scope.init(args);
        });
    }

    $scope.zoom = 10;
    $scope.polygons = [];
    $scope.areaLoaded = false;
    $scope.tags = "a";
    $scope.series = ['Popular Tags'];
    $scope.showCols = "col-md-2";

    $scope.data = [
        []
    ];

    uiGmapGoogleMapApi.promise().then(function(maps) {
        google.maps.event.trigger(maps[0].map, 'resize');
    });

    autocomplete = new google.maps.places.Autocomplete(
        /** @type {!HTMLInputElement} */(document.getElementById('autocomplete')),
        {types: ['address']});

    function UpdatePlace(lng, lat, placename){
        locationTipsFactory.getTips([lng, lat]).success(function(data) {

        $scope.labels = [];
        $scope.data[0] = [];
        $scope.chefDetails.location = [lng, lat];
        $scope.showTips = data.showTips;

        if(data.showTips)
        {
            $scope.showCols = "col-md-4";
            $scope.tags = [];
            $scope.areaLoaded = true;
            $scope.polygons = [];

            for (i = 0; i < data.areas.length; i++) {
                var currPolygon =  {
                    id: i,
                    path: data.areas[i].area,
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
                };

                if(data.areas[i]._id == data.selected) {
                    for (j = 0; j < data.areas[i].popularTags.length; j++){
                        $scope.data[0].push(data.areas[i].popularTags[j].count);
                        $scope.labels.push(data.areas[i].popularTags[j].tag);
                    }

                    currPolygon.fill.color = '#53AE68'
                }

                $scope.polygons.push(currPolygon);
            }
        }
        else{
            $scope.showCols = "col-md-2";
            $scope.tags = [];
            $scope.areaLoaded = true;
            $scope.polygons = [];
        }

        $scope.zoom = 15;
        $scope.chefDetails.locationName = placename;
        $scope.locationChosen = true;
    });

    }

    google.maps.event.addListener(autocomplete, 'place_changed', function() {
        var place = autocomplete.getPlace();

        UpdatePlace(place.geometry.location.lng(), place.geometry.location.lat(), place.formatted_address);

    });

    $scope.setNext = function(){

        if ($scope.isActive1)
        {
            $scope.isActive1 = false;
            $scope.isActive2 = true;
        }
    };

    $scope.setPrevious = function(){
        if ($scope.isActive2)
        {
            $scope.isActive1 = true;
            $scope.isActive2 = false;
        }
    };

    $scope.sendData = function()
    {
        if (!$scope.isEdit)
        {
            chefsFactory.create($scope.chefDetails).success(function(data) {
                alert ("chef saved!" + "  " + data);
                userFactory.isChefUpdate(true);
                location.href = "/";
            }).error(function(data) {
                alert(data);
            });
        }
        else
        {
            chefsFactory.update($scope.chefDetails).success(function(data) {
                alert ("chef saved!" + "  " + data);
                userFactory.isChefUpdate(true);
                location.href = "/";
            }).error(function(data) {
                alert(data);
            });
        }
    }
}]);