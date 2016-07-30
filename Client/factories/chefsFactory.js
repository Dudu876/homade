/**
 * Created by Michael on 4/5/2016.
 */

var chefURL = '/api/chefs/';
homadeApp.factory('chefsFactory', ['$http', function($http) {

    return {
        create : function(chefData) {
            return $http.post(chefURL, chefData);
        },
        isChef : function(fbId) {
            return $http.get(chefURL + fbId);
        },
        get : function(fbId) {
            return $http.get(chefURL + 'details/' + fbId)
        },
        update : function(chefData) {
            return $http.put(chefURL, chefData);
        }
    }
}]);