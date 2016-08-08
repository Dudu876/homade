/**
 * Created by Michael on 4/28/2016.
 */
homadeApp.controller('chefOrdersCtrl', ['$scope', '$rootScope', 'ordersFactory', 'chefsFactory', 'userFactory', 'messageFactory', 'ezfb', '$uibModal', function ($scope, $rootScope, ordersFactory, chefsFactory, userFactory, messageFactory, ezfb, $uibModal) {
    var statusesArr = ['Order Received', 'Cooking', 'Ready', 'Taken'];
    $rootScope.loading = 0;
    $rootScope.loading++;

    $scope.$on('isChefUpdate', function (event, args) {
        ordersFactory.getActiveOrdersByChef(userFactory.fbId).success(function (data) {
            updateClientNamesAndFillOrders(data);
        });
    });

    var updateClientNamesAndFillOrders = function(data){
        $scope.activeOrders = data;
        $rootScope.loading += $scope.activeOrders - 1;
        $scope.activeOrders.forEach(function(element, index, array) {
            ezfb.api(element.clientFBId + '?fields=name', function (res) {
                if (!res.error)
                {
                    element.clientName = res.name;
                }

                $rootScope.loading--;
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

    $scope.open = function (order, isComment) {
        var comment = order.comment;
        var title = 'Comment';
        if (!isComment){
            title = 'Message';
            comment = '';
        }
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/commentOnOrder.html',
            controller: 'commentOnOrderCtrl',
            resolve: {
                comment: function () {
                    return comment;
                },
                title: function () {
                    return title;
                }
            }
        });

        modalInstance.result.then(function (result) {
            if (isComment) {
                order.comment = result;
                ordersFactory.update(order).success(function (res) {
                    if (!(res == "succesfully saved")) {
                        alert('error occured');
                    }
                    else {
                    }
                });
            }
            else {
                if (result == "" || result === undefined) return;
                var now = new Date();
                var newMessage = {
                    author: {
                        fbId: userFactory.fbId,
                        name: userFactory.fullname
                    },
                    target: {
                        fbId: order.clientFBId
                    },
                    time: now,
                    content: result
                };
                messageFactory.post(newMessage);
            }
        });
    };

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