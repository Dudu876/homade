/**
 * Created by Dudu on 08/03/2016.
 */
angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider
    // home page
        .when('/', {
            templateUrl: 'views/mainPage.html',
            controller: 'mainPageCtrl'
        })
        .when('/BecomeAChef', {
            templateUrl: 'views/becomeChef.html',
            controller: 'becomeChef'
        })
        .when('/AddMeal', {
            templateUrl: 'views/addMeal.html',
            controller: 'addMealCtrl'
        })
        .when('/Map', {
            templateUrl: 'views/Map.html',
            controller: 'mapCtrl'
        })
        .when('/Profile', {
            templateUrl: 'views/contact.html',
        })
        .otherwise({
            redirectTo: '/'
        });

    $locationProvider.html5Mode(true);
}]);

