/**
 * Created by Michael on 4/28/2016.
 */
homadeApp.controller('chefHistoryCtrl', ['$scope', 'ordersFactory', 'chefsFactory', 'userFactory', 'ezfb', function ($scope, ordersFactory, chefsFactory, userFactory, ezfb) {


    var updateClientNamesAndFillOrders = function(data){
        $scope.orders = data;
        $scope.orders.forEach(function(element, index, array) {
            ezfb.api(element.clientFBId + '?fields=name', function (res) {
                if (!res.error)
                {
                    element.clientName = res.name;
                }
            });
        });
    };

    if (userFactory.fbId != "")
    {
        chefsFactory.isChef(userFactory.fbId).success(function (isChef) {
            if (isChef) {
                ordersFactory.getCompleteOrdersByChef(userFactory.fbId).success(function(data) {
                    updateClientNamesAndFillOrders(data);
                });
            }
        });
    }
    else {
        $scope.$on('isChefUpdate', function (event, args) {
            ordersFactory.getCompleteOrdersByChef(userFactory.fbId).success(function (data) {
                updateClientNamesAndFillOrders(data);
            });
        });
    }

    $scope.formatDate = function(date){
        var dateOut = new Date(date);
        return dateOut;
    };
}]);