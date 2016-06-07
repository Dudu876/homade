/**
 * Created by Michael on 5/30/2016.
 */
homadeApp.controller('chefDashboardCtrl', ['$scope', 'ordersFactory', 'userFactory', 'messageFactory', 'ezfb', function ($scope, ordersFactory, userFactory, messageFactory, ezfb) {

    var init = function() {
        $scope.chefName = userFactory.name;

        ezfb.api(userFactory.fbId + '/picture?height=200&width=205', function (res) {
            if (!res.error)
            {
                $scope.picture = res.data.url;
            }
        });

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

        messageFactory.getOnlyReceived(userFactory.fbId).success(function (data)
        {
            $scope.messages = data;
            $scope.messages.forEach(function(element, index, array) {
                element.author.name = element.author.name.substring(0, element.author.name.indexOf(" "));
                ezfb.api(element.author.fbId + '?fields=picture', function (res) {
                    if (!res.error)
                    {
                        element.picture = res.picture.data.url;
                    }
                });
            });

        });
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