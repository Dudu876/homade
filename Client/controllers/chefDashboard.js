/**
 * Created by Michael on 5/30/2016.
 */
homadeApp.controller('chefDashboardCtrl', ['$scope', 'ordersFactory', 'userFactory', 'ezfb', function ($scope, ordersFactory, userFactory, ezfb) {

    var getOrdersCount = function(){
        ordersFactory.getOrdersCount(userFactory.fbId).success(function(data)
        {
            $scope.totalOrders = data.total;
            $scope.lastMonth = data.lastMonth;
        });

        ordersFactory.getCompleteOrdersByChef(userFactory.fbId).success(function(data)
        {
            $scope.completeOrders = data;
            $scope.completeOrders.forEach(function(element, index, array) {
                ezfb.api(element.clientFBId + '?fields=name', function (res) {
                    if (!res.error)
                    {
                        element.clientName = res.name;
                    }
                });
            });
        });

        ordersFactory.getActiveOrdersByChef(userFactory.fbId).success(function(data)
        {
            $scope.activeOrders = data;
            $scope.activeOrders.forEach(function(element, index, array) {
                ezfb.api(element.clientFBId + '?fields=name', function (res) {
                    if (!res.error)
                    {
                        element.clientName = res.name;
                    }
                });
            });
        });
    };

    var init = function() {
        getOrdersCount();
    };

    $scope.formatDate = function(date){
        var dateOut = new Date(date);
        return dateOut;
    };

    $scope.fullStars = function(order) {
        if (order.rating != null)
        {
            return new Array(order.rating);
        }
        else {
            return new Array(0);
        }
    };

    $scope.emptyStars = function(order) {
        if (order.rating != null) {
            return new Array(5 - order.rating);
        }
        else {
            return new Array(5);
        }
    };

    if (userFactory.fbId != "") {
        init();
    }
    else {
        $scope.$on('isChefUpdate', function (event, args) {
            init();
        });
    }

}]);