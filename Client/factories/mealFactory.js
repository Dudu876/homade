/**
 * Created by Dudu on 25/03/2016.
 */

var mealURL = '/api/meals/';
var mealOfChefURL = '/api/meals/bychef/';
homadeApp.factory('mealFactory', ['$http', function($http) {

    return {
        getMealsOfChef: function(fbId) {
            return $http.get(mealOfChefURL + fbId)  ;
        },
        getMeal : function(mealId) {
            return $http.get(mealURL + mealId)  ;
        },
        // call to get all meals
        get : function() {
            return $http.get(mealURL);
        },
        // these will work when more API routes are defined on the Node side of things
        // call to POST and create a new meal
        create : function(mealData) {
            return $http.post(mealURL, mealData);
        },
        // these will work when more API routes are defined on the Node side of things
        // call to put and edit branch
        update : function(mealData) {
            return $http.put(mealURL, mealData);
        },
        // call to DELETE a meal
        delete : function(number) {
            return $http.delete(mealURL + number);
        }
        // search meal
        //searchmeal : function(search) {
        //    return $http.post(searchURL, search);
        //},
    }
}]);
