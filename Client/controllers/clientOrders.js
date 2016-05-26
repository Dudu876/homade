/**
 * Created by Michael on 4/28/2016.
 */
homadeApp.controller('clientOrdersCtrl', ['$scope', 'ordersFactory', 'chefsFactory', 'userFactory', 'ezfb', '$uibModal', function ($scope, ordersFactory, chefsFactory, userFactory, ezfb, $uibModal) {
    var statusesArr = ['Order Received', 'Cooking', 'Ready', 'Taken'];

    $scope.$on('isChefUpdate', function (event, args) {
        ordersFactory.getActiveOrdersByClient(userFactory.fbId).success(function (data) {
            updateChefNamesAndFillOrders(data);
        });
    });

    $scope.saveOrder = function(data) {
        ordersFactory.update(data).success(function(res){
            if (!(res == "succesfully saved")) {
                alert('error occured');
            }
        });
    };

    $scope.open = function (order) {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'commentOnOrder.html',
            controller: 'commentOnOrderCtrl',
            resolve: {
                comment: function () {
                    return order.comment;
                }
            }
        });

        modalInstance.result.then(function (comment) {
            order.comment = comment;
            ordersFactory.update(order).success(function(res){
                if (!(res == "succesfully saved")) {
                    alert('error occured');
                }
                else {
                }
            });
        });
    };


    var updateChefNamesAndFillOrders = function(data){
        $scope.orders = data;
        $scope.orders.forEach(function(element, index, array) {
            ezfb.api(element.chefFBId + '/picture?height=100&width=100', function (res) {
                if (!res.error)
                {
                    element.chefPic = res.data.url;
                }
                else
                {
                    element.chefPic = "../public/images/BlankPicture.png";
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