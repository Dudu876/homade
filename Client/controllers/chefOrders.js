/**
 * Created by Michael on 4/28/2016.
 */
homadeApp.controller('chefOrders', ['$scope', 'ordersFactory', 'userFactory', function ($scope, ordersFactory, userFactory) {
    ordersFactory.getOrdersByChef(userFactory.fbId).success(function(data) {
        $scope.activeOrders = data;
    });
}]);