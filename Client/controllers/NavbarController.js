/**
 * Created by Michael on 3/18/2016.
 */

homadeApp.controller('NavbarController', function NavbarController($scope, ezfb, $location, userFactory, chefsFactory) {

    $scope.loggedIn = false;
    $scope.loggedInStatusVerified = false;
    $scope.loadedChefData = false;
    $scope.isChef = false;

    $scope.search = {};

    $scope.$on('isChefUpdate', function(event, args){
        $scope.isChef = args;
    });

    $scope.search = function() {
        $location.url('/Result?q=' + $scope.search.text);
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
            chefsFactory.isChef(userFactory.fbId).success(function(data) {
                userFactory.isChefUpdate(data);
                $scope.loadedChefData = true;
            }).error(function(data) {
                alert('Error!');
            });
        });
    }
});