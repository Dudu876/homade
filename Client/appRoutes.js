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
        .when('/Result', {
            templateUrl: 'views/searchedOrders.html',
            controller: 'resultCtrl'
        })
        .when('/OrderMeal:id', {
            templateUrl: 'views/orderMeal.html',
            controller: 'orderMealCtrl'
        })
        .when('/OrderMeal', {
            templateUrl: 'views/orderMeal.html',
            controller: 'orderMealCtrl'
        })
        .when('/OrderMeal/:id', {
            templateUrl: 'views/orderMeal.html',
            controller: 'orderMealCtrl'
        })
        .when('/Profile', {
            templateUrl: 'views/contact.html',
        })
        .when('/ChefOrders', {
            templateUrl: 'views/chefOrders.html',
            controller: 'chefOrdersCtrl'
        })
        .when('/ChefMeals', {
            templateUrl: 'views/chefMeals.html',
            controller: 'chefMealsCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });

    $locationProvider.html5Mode(true);
}]);

