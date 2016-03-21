/**
 * Created by Dudu on 08/03/2016.
 */
angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider
    // home page
        .when('/', {
            templateUrl: 'Views/mainPage.html',
            controller: 'mainPage'
        })
        .when('/Contact', {
            templateUrl: 'Views/addMeal.html',
        })
        .otherwise({
            redirectTo: '/'
        });

    $locationProvider.html5Mode(true);
}]);

