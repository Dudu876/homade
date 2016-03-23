/**
 * Created by Michael on 3/18/2016.
 */

homadeApp.controller('NavbarController', function NavbarController($scope, ezfb, $location) {

    $scope.loggedIn = false;
    $scope.loggedInStatusVerified = false;

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
        ezfb.api('/me?fields=id,picture,first_name', function (res) {
            $scope.apiMe = res;
        });
    }
});