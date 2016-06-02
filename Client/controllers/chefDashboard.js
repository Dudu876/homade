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

        });
    };

    var init = function() {
        getOrdersCount();
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