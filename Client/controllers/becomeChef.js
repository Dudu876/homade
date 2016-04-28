/**
 * Created by Michael on 3/31/2016.
 */
homadeApp.controller('becomeChef', ['$scope', 'locationTipsFactory', 'chefsFactory', 'userFactory', function ($scope, locationTipsFactory, chefsFactory, userFactory) {
    $scope.isActive1 = true;
    $scope.isActive2 = false;
    $scope.isActive3 = false;
    $scope.locationChosen = false;
    $scope.chefDetails = {};
    $scope.chefDetails.fbId = userFactory.fbId;
    $scope.chefDetails.name = userFactory.fullname;

    autocomplete = new google.maps.places.Autocomplete(
        /** @type {!HTMLInputElement} */(document.getElementById('autocomplete')),
        {types: ['geocode']});

    google.maps.event.addListener(autocomplete, 'place_changed', function() {
        var place = autocomplete.getPlace();
        $scope.chefDetails.location = [place.geometry.location.lat(), place.geometry.location.lng()];
        $scope.chefDetails.locationName = place.formatted_address;
        $scope.locationChosen = true;
        $scope.$apply();
    });

    $scope.setNext = function(){

        if ($scope.isActive1)
        {
            $scope.isActive1 = false;
            $scope.isActive2 = true;
            locationTipsFactory.get().success(function(data) {
            }).error(function(data) {
            });
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
    };

    var startingTime = new Date();
    startingTime.setHours(8);
    startingTime.setMinutes(0);


    var finishTime = new Date();
    finishTime.setHours(18);
    finishTime.setMinutes(0);

    $scope.chefDetails.workDays = [
        { day: 1, dayName: 'Sunday', isWorking:false, startingTime: startingTime, finishTime: finishTime },
        { day: 2, dayName: 'Monday', isWorking:false, startingTime: startingTime, finishTime: finishTime },
        { day: 3, dayName: 'Tuesday', isWorking:false, startingTime: startingTime, finishTime: finishTime },
        { day: 4, dayName: 'Wedenesday', isWorking:false, startingTime: startingTime, finishTime: finishTime },
        { day: 5, dayName: 'Thursday', isWorking:false, startingTime: startingTime, finishTime: finishTime },
        { day: 6, dayName: 'Friday', isWorking:false, startingTime: startingTime, finishTime: finishTime },
        { day: 7, dayName: 'Saturday', isWorking:false, startingTime: startingTime, finishTime: finishTime }
    ];

    $scope.sendData = function()
    {
        chefsFactory.create($scope.chefDetails).success(function(data) {
            alert ("chef saved!" + "  " + data);
            userFactory.isChefUpdate(true);
            location.href = "/";
        }).error(function(data) {
            alert(data);
        });
    }
}]);