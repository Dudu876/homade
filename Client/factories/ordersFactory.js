/**
 * Created by Michael on 4/23/2016.
 */
var ordersUrl = '/api/orders/';
homadeApp.factory('ordersFactory', ['$http', function($http) {

    return {
        create : function(order) {
            return $http.post(ordersUrl, order);
        },
        getOrdersByChef : function(chefId) {
            return $http.get(ordersUrl, chefId);
        }
    }
}]);