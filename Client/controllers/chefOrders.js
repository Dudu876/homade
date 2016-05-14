/**
 * Created by Michael on 4/28/2016.
 */
homadeApp.controller('chefOrdersCtrl', ['$scope', 'ordersFactory', 'chefsFactory', 'userFactory', 'ezfb', function ($scope, ordersFactory, chefsFactory, userFactory, ezfb) {
    var statusesArr = ['Order Received', 'Cooking', 'Ready', 'Taken'];

    $scope.$on('isChefUpdate', function (event, args) {
        ordersFactory.getActiveOrdersByChef(userFactory.fbId).success(function (data) {
            updateClientNamesAndFillOrders(data);
        });
    });

    var updateClientNamesAndFillOrders = function(data){
        $scope.activeOrders = data;
        $scope.activeOrders.forEach(function(element, index, array) {
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
                ordersFactory.getActiveOrdersByChef(userFactory.fbId).success(function(data) {
                    updateClientNamesAndFillOrders(data);
                });
            }
        });
    }

    $scope.formatDate = function(date){
        var dateOut = new Date(date);
        return dateOut;
    };

    $scope.getStatusName = function(num, includePrefix) {
        var status = "Status: ";

        if (includePrefix)
        {
            return status + statusesArr[num];
        }
        else
        {
            return statusesArr[num];
        }
    };

    $scope.updateStatus = function(order){
        order.status = order.status + 1;

        if (order.status == 3){
            order.endDate = new Date();
        }

        ordersFactory.update(order).success(function(data){

        });
    }
}]);