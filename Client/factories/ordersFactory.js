/**
 * Created by Michael on 4/23/2016.
 */
var ordersUrl = '/api/orders/';
var activeOrdersUrl = '/api/orders/active/';
homadeApp.factory('ordersFactory', ['$http', function($http) {

    return {
        create : function(order) {
            return $http.post(ordersUrl, order);
        },
        getOrdersByChef : function(chefId) {
            return $http.get(ordersUrl, chefId);
        },
        getActiveOrdersByChef : function(chefId) {
            return $http.get(activeOrdersUrl +  chefId);
        }
    }
}]);