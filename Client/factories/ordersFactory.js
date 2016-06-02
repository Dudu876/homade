/**
 * Created by Michael on 4/23/2016.
 */
var ordersUrl = '/api/orders/';
var activeOrdersUrl = '/api/orders/active/';
var activeClientOrdersUrl = '/api/orders/activeclient/';
var completeOrdersUrl = '/api/orders/complete/';
var mealOrdersUrl = 'api/orders/meal/';
var connctionsUrl = 'api/orders/connections/';

homadeApp.factory('ordersFactory', ['$http', function($http) {

    return {
        create : function(order) {
            return $http.post(ordersUrl, order);
        },
        update: function(order) {
            return $http.put(ordersUrl, order);
        },
        getCompleteOrdersByChef : function(chefId) {
            return $http.get(completeOrdersUrl + chefId);
        },
        getActiveOrdersByChef : function(chefId) {
            return $http.get(activeOrdersUrl +  chefId);
        },
        getActiveOrdersByClient : function(clientId) {
            return $http.get(activeClientOrdersUrl +  clientId);
        },
        getOrdersByMeal : function(mealID, count) {
            return $http.get(mealOrdersUrl + mealID + "/" + count);
        },
        getConnections : function(fbId) {
            return $http.get(connctionsUrl + fbId);
        }
    }
}]);