/**
 * Created by Michael on 4/28/2016.
 */
homadeApp.controller('chefOrdersCtrl', ['$scope', 'ordersFactory', 'chefsFactory', 'userFactory', function ($scope, ordersFactory, chefsFactory, userFactory) {
    $scope.$on('isChefUpdate', function (event, args) {
        ordersFactory.getActiveOrdersByChef(userFactory.fbId).success(function (data) {
            $scope.activeOrders = data;
        });
    });

    if (userFactory.fbId != "")
    {
        chefsFactory.isChef(userFactory.fbId).success(function (isChef) {
            if (isChef) {
                ordersFactory.getActiveOrdersByChef(userFactory.fbId).success(function(data) {
                    $scope.activeOrders = data;
                });
            }
        });
    }

    $scope.formatDate = function(date){
        var dateOut = new Date(date);
        return dateOut;
    };

    $scope.getStatusName = function(num) {
        if (num == 1){
            return "Status: Received";
        }
        else if (num == 2){
            return "Status: Cooking";
        }
        else if (num == 3){
            return "Status: Ready";
        }
    }
}]);