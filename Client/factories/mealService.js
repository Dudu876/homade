/**
 * Created by Dudu on 28/04/2016.
 */

var mealURL = '/api/meals/';
homadeApp.service('mealService', ['$http', '$q', '$timeout', function($http, $q, $timeout) {

    var meals;

    var deferred = $q.defer();
    var promise;

    // call to get all meals
    this.get = function() {
        //return $http.get(mealURL);
        if ( !meals ) {
            // $http returns a promise, which has a then function, which also returns a promise
            promise = $http.get(mealURL);

            promise.then(function (response) {
                meals = response.data;
            });

            return promise;
        }

        $timeout(function() {
            deferred.resolve(meals);
        }, 500);

        return deferred.promise;
    };
    // these will work when more API routes are defined on the Node side of things
    // call to POST and create a new meal
    this.create = function(mealData) {
        return $http.post(mealURL, mealData);
    };
    // these will work when more API routes are defined on the Node side of things
    // call to put and edit branch
    this.update = function(mealData) {
        return $http.put(mealURL, mealData);
    };
    // call to DELETE a meal
    this.delete = function(number) {
        return $http.delete(mealURL + number);
    };
    // search meal
    //searchmeal : function(search) {
    //    return $http.post(searchURL, search);
    //},

}]);