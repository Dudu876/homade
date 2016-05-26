/**
 * Created by Michael on 4/23/2016.
 */
var ordersUrl = '/api/orders/';
var activeOrdersUrl = '/api/orders/active/';
var activeClientOrdersUrl = '/api/orders/activeclient/';
var completeOrdersUrl = '/api/orders/complete/';

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
        }
    }
}]);