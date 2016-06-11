/**
 * Created by Michael on 3/18/2016.
 */

homadeApp.controller('NavbarController', function NavbarController($scope, $rootScope, ezfb, $location, userFactory, chefsFactory, mealFactory) {

    $scope.loggedIn = false;
    $scope.loggedInStatusVerified = false;
    $scope.loadedChefData = false;
    $scope.isChef = false;

    if ($rootScope.search == null){
        $rootScope.search = {};
    }

    $scope.search = $rootScope.search;
    loadAllTags();


    function loadAllTags() {
        mealFactory.getAllTags().success(function(tags) {
            $scope.tags = tags;
            console.log('tags loaded!');
        });
    }

    var navAutocomplete = new google.maps.places.Autocomplete(
        /** @type {!HTMLInputElement} */(document.getElementById('navAutocomplete')),
        {types: ['address']});

    google.maps.event.addListener(navAutocomplete, 'place_changed', function() {
        var place = navAutocomplete.getPlace();
        $scope.search.latlng = [place.geometry.location.lng(), place.geometry.location.lat()];
        $scope.search.location = place.formatted_address;
    });

    $scope.$on('isChefUpdate', function(event, args){
        $scope.isChef = args;
    });

    $scope.$on('SEARCH', function(event, args) {
        $scope.search = args;
    });


    $scope.onSelect = function(data) {
        if (data != null) {
            if (data.title != null) {
                $scope.search.query = data.title;
                $scope.go();
            }
        }
    };

    $scope.go = function() {
        if ($scope.search.query === undefined) return;
        if ($scope.search.location == "") $scope.search.latlng = undefined;
        $rootScope.search = $scope.search;
        $rootScope.$broadcast('SEARCH',$scope.search);
        $location.url('/Result?q=' + $scope.search.query);
    };

    $scope.getProfile = function() {
        if ($scope.isChef) {
            return "/Profile";
        }
        else
        {
            return "/";
        }
    };

    updateLoginStatus(updateApiMe);

    $scope.login = function () {
        ezfb.login(function (res) {
            if (res.authResponse) {
                updateLoginStatus(updateApiMe);
            }
        }, {scope: 'email,user_likes'});
    };

    $scope.shouldShowFilter = function (){
        return (location.pathname != "/");
    };

    $scope.logout = function () {
        /**
         * Calling FB.logout
         * https://developers.facebook.com/docs/reference/javascript/FB.logout
         */
        ezfb.logout(function () {
            updateLoginStatus(updateApiMe);
            location.href = "/";
        });
    };

    function updateLoginStatus (more)
    {
        ezfb.getLoginStatus(function (res) {
            $scope.loggedInStatusVerified = true;
            parseResultStatusToLogin(res);
        });
    }

    function parseResultStatusToLogin(res)
    {
        if (res.status == "connected")
        {
            $scope.loggedIn = true;
            updateApiMe();
        }
        else
        {
            $scope.loggedIn = false;
        }
    }

    function updateApiMe()
    {
        ezfb.api('/me?fields=id,picture,first_name,name', function (res) {
            $scope.apiMe = res;
            userFactory.name = res.first_name;
            userFactory.fullname = res.name;
            userFactory.fbId = res.id;
            if (res.picture !== undefined) {
                userFactory.picture = res.picture.data.url;
            }
            else {
                userFactory.picture = '../public/images/BlankPicture.png';
            }
            chefsFactory.isChef(userFactory.fbId).success(function(data) {
                userFactory.isChef = data;
                userFactory.isChefUpdate(data);
                $scope.loadedChefData = true;
            }).error(function(data) {
                alert('Error!');
            });
        });
    }
});