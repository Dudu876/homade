/**
 * Created by Michael on 4/2/2016.
 */

var locationTipsURL = '/api/locationTips/';
homadeApp.factory('locationTipsFactory', ['$http', function($http) {
    return {
        // call to get location tips
        get : function() {
            return $http.get(locationTipsURL);
        }
    }
}]);
