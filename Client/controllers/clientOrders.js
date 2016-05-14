/**
 * Created by Michael on 4/28/2016.
 */
homadeApp.controller('clientOrdersCtrl', ['$scope', 'ordersFactory', 'chefsFactory', 'userFactory', 'ezfb', function ($scope, ordersFactory, chefsFactory, userFactory, ezfb) {
    var statusesArr = ['Order Received', 'Cooking', 'Ready', 'Taken'];

    $scope.$on('isChefUpdate', function (event, args) {
        ordersFactory.getActiveOrdersByClient(userFactory.fbId).success(function (data) {
            updateChefNamesAndFillOrders(data);
        });
    });

    var updateChefNamesAndFillOrders = function(data){
        $scope.activeOrders = data;
        $scope.activeOrders.forEach(function(element, index, array) {
            ezfb.api(element.chefFBId + '?fields=name', function (res) {
                if (!res.error)
                {
                    element.chefName = res.name;
                }
            });
        });
    };

    if (userFactory.fbId != "")
    {
        chefsFactory.isChef(userFactory.fbId).success(function (isChef) {
            if (isChef) {
                ordersFactory.getActiveOrdersByClient(userFactory.fbId).success(function(data) {
                    updateChefNamesAndFillOrders(data);
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
}]);